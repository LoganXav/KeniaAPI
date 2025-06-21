import { autoInjectable } from "tsyringe";
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
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, CLASS_PROMOTION_RESOURCE, ERROR, STUDENT_RESOURCE, SOMETHING_WENT_WRONG } from "~/api/shared/helpers/messages/SystemMessages";
import ClassDivisionReadProvider from "../../classDivision/providers/ClassDivisionRead.provider";
import { Student } from "@prisma/client";
import { StudentWithRelationsSafeUser } from "../../student/types/StudentTypes";

@autoInjectable()
export default class ClassPromotionCreateService extends BaseService<IRequest> {
  static serviceName = "ClassPromotionCreateService";
  private studentReadCache: StudentReadCache;
  private studentUpdateProvider: StudentUpdateProvider;
  private classDivisionReadProvider: ClassDivisionReadProvider;
  private classPromotionReadProvider: ClassPromotionReadProvider;
  private classPromotionCreateProvider: ClassPromotionCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(classDivisionReadProvider: ClassDivisionReadProvider, studentUpdateProvider: StudentUpdateProvider, classPromotionReadProvider: ClassPromotionReadProvider, studentReadCache: StudentReadCache, classPromotionCreateProvider: ClassPromotionCreateProvider) {
    super(ClassPromotionCreateService.serviceName);
    this.studentReadCache = studentReadCache;
    this.studentUpdateProvider = studentUpdateProvider;
    this.classDivisionReadProvider = classDivisionReadProvider;
    this.classPromotionReadProvider = classPromotionReadProvider;
    this.classPromotionCreateProvider = classPromotionCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { studentId, calendarId, tenantId } = args.body;

      const foundStudent = await this.studentReadCache.getOneByCriteria({ tenantId, id: studentId });

      if (!foundStudent) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STUDENT_RESOURCE));
      }

      const foundPromotionDecision = await this.classPromotionReadProvider.getOneByCriteria({ tenantId, calendarId, studentId });

      if (foundPromotionDecision) {
        throw new BadRequestError("Student Promotion already decided.");
      }

      const classPromotionRecord = await this.createClassPromotionTransaction({ foundStudent, ...args.body });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(CLASS_PROMOTION_RESOURCE), classPromotionRecord);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async createClassPromotionTransaction(args: ClassPromotionCreateRequestType & { foundStudent: StudentWithRelationsSafeUser }) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const classDivision = await this.classDivisionReadProvider.getOneByCriteria({ name: args?.foundStudent?.classDivision?.name, tenantId: args.tenantId, classId: args.toClassId });
        const student = await this.studentUpdateProvider.updateOne({ id: args.studentId, classId: args.toClassId, tenantId: args.tenantId, classDivisionId: classDivision?.id }, tx);

        if (!args?.foundStudent?.classId) {
          throw new BadRequestError("Student not currently enrolled in a class");
        }

        const classPromotionRecord = await this.classPromotionCreateProvider.create({ ...args, fromClassId: args?.foundStudent?.classId });
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
