import { autoInjectable } from "tsyringe";
import { ClassList, Status } from "@prisma/client";
import ClassReadCache from "../cache/ClassRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import StudentReadCache from "../../student/cache/StudentRead.cache";
import { ClassPromotionCreateRequestType } from "../types/ClassTypes";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import ClassPromotionReadProvider from "../providers/ClassPromotionRead.provider";
import StudentUpdateProvider from "../../student/providers/StudentUpdate.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ClassPromotionCreateProvider from "../providers/ClassPromotionCreate.provider";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { StudentWithRelationsSafeUser } from "~/api/modules/student/types/StudentTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import ClassDivisionReadProvider from "../../classDivision/providers/ClassDivisionRead.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import StudentSubjectRegistrationUpdateProvider from "~/api/modules/student/providers/StudentSubjectRegistrationUpdate.provider";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, CLASS_PROMOTION_RESOURCE, ERROR, STUDENT_RESOURCE, SOMETHING_WENT_WRONG } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class ClassPromotionCreateService extends BaseService<IRequest> {
  static serviceName = "ClassPromotionCreateService";
  private classReadCache: ClassReadCache;
  private studentReadCache: StudentReadCache;
  private studentUpdateProvider: StudentUpdateProvider;
  private classDivisionReadProvider: ClassDivisionReadProvider;
  private classPromotionReadProvider: ClassPromotionReadProvider;
  private classPromotionCreateProvider: ClassPromotionCreateProvider;
  private studentSubjectRegistrationUpdateProvider: StudentSubjectRegistrationUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(
    classReadCache: ClassReadCache,
    studentReadCache: StudentReadCache,
    studentUpdateProvider: StudentUpdateProvider,
    classDivisionReadProvider: ClassDivisionReadProvider,
    classPromotionReadProvider: ClassPromotionReadProvider,
    classPromotionCreateProvider: ClassPromotionCreateProvider,
    studentSubjectRegistrationUpdateProvider: StudentSubjectRegistrationUpdateProvider
  ) {
    super(ClassPromotionCreateService.serviceName);
    this.classReadCache = classReadCache;
    this.studentReadCache = studentReadCache;
    this.studentUpdateProvider = studentUpdateProvider;
    this.classDivisionReadProvider = classDivisionReadProvider;
    this.classPromotionReadProvider = classPromotionReadProvider;
    this.classPromotionCreateProvider = classPromotionCreateProvider;
    this.studentSubjectRegistrationUpdateProvider = studentSubjectRegistrationUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { studentId, calendarId, tenantId, promotionStatus } = args.body;

      const foundStudent = await this.studentReadCache.getOneByCriteria({ tenantId, id: studentId });

      if (!foundStudent) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STUDENT_RESOURCE));
      }

      const foundPromotionDecision = await this.classPromotionReadProvider.getOneByCriteria({ tenantId, calendarId, studentId });

      if (foundPromotionDecision) {
        throw new BadRequestError("Student Promotion already decided.");
      }

      const classDivisionId = await this.classDivisionReadProvider.getOneByCriteria({ tenantId, name: args.body.toClassDivisionName, classId: args.body.toClassId });

      if (!classDivisionId) {
        throw new BadRequestError("The Class Division doesn't exist for the next class");
      }

      const studentCurrentClassId = foundStudent?.classId;

      if (!studentCurrentClassId) {
        throw new BadRequestError("Student not currently enrolled in a class");
      }

      const studentCurrentClassDivisionId = foundStudent?.classDivisionId;

      if (!studentCurrentClassDivisionId) {
        throw new BadRequestError("Student not currently enrolled in a class division");
      }

      const [currentClass, targetClass] = await Promise.all([this.classReadCache.getOneByCriteria({ tenantId, id: studentCurrentClassId }), this.classReadCache.getOneByCriteria({ tenantId, id: args.body.toClassId })]);

      if (!currentClass || !currentClass.name || !targetClass || !targetClass.name) {
        throw new BadRequestError("Invalid current or target class");
      }

      // ✅ Compare class positions in enum order
      const classOrder = Object.keys(ClassList); // ['JSS1', 'JSS2', ...]
      const currentIndex = classOrder.indexOf(currentClass.name);
      const targetIndex = classOrder.indexOf(targetClass.name);

      if (promotionStatus === "Promoted" && targetIndex <= currentIndex) {
        throw new BadRequestError("Cannot promote to a class on or below the current class.");
      }

      if (promotionStatus === "Withheld" && targetIndex != currentIndex) {
        throw new BadRequestError("Students marked as 'Withheld' must remain in their current class.");
      }

      const classPromotionRecord = await this.createClassPromotionTransaction({ foundStudent, fromClassDivisionId: studentCurrentClassDivisionId, toClassDivisionId: classDivisionId?.id, fromClassId: studentCurrentClassId, ...args.body });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(CLASS_PROMOTION_RESOURCE), classPromotionRecord);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async createClassPromotionTransaction(args: ClassPromotionCreateRequestType & { foundStudent: StudentWithRelationsSafeUser; toClassDivisionId: number; fromClassDivisionId: number; fromClassId: number }) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        await this.studentUpdateProvider.updateOne({ id: args.studentId, classId: args.toClassId, tenantId: args.tenantId, classDivisionId: args.toClassDivisionId }, tx);

        const classPromotionRecord = await this.classPromotionCreateProvider.create({ ...args, fromClassId: args.fromClassId, fromClassDivisionId: args.fromClassDivisionId });

        await this.studentSubjectRegistrationUpdateProvider.updateByCriteria(
          {
            tenantId: args.tenantId,
            status: Status.Inactive,
            studentId: args.studentId,
            calendarId: args.calendarId,
          },
          tx
        );

        await this.studentReadCache.invalidate(args.tenantId);

        return { classPromotionRecord };
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
