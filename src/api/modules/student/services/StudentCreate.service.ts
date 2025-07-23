import { UserType } from "@prisma/client";
import { autoInjectable } from "tsyringe";
import ServerConfig from "~/config/ServerConfig";
import StudentReadCache from "../cache/StudentRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { StudentCreateRequestType } from "../types/StudentTypes";
import UserReadCache from "~/api/modules/user/cache/UserRead.cache";
import { BaseService } from "~/api/modules/base/services/Base.service";
import ClassReadCache from "~/api/modules/class/cache/ClassRead.cache";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StudentCreateProvider from "../providers/StudentCreate.provider";
import UserReadProvider from "~/api/modules/user/providers/UserRead.provider";
import GuardianReadCache from "~/api/modules/guardian/cache/GuardianRead.cache";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import UserCreateProvider from "~/api/modules/user/providers/UserCreate.provider";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { CLASS_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import SubjectReadProvider from "~/api/modules/subject/providers/SubjectRead.provider";
import { GuardianUpdateRequestType } from "~/api/modules/guardian/types/GuardianTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import GuardianUpdateProvider from "~/api/modules/guardian/providers/GuardianUpdate.provider";
import GuardianCreateProvider from "~/api/modules/guardian/providers/GuardianCreate.provider";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import ClassDivisionReadProvider from "~/api/modules/classDivision/providers/ClassDivisionRead.provider";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { SUCCESS, SOMETHING_WENT_WRONG, STUDENT_RESOURCE, GUARDIAN_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_ALREADY_EXISTS, RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class StudentCreateService extends BaseService<IRequest> {
  static serviceName = "StudentCreateService";
  userReadCache: UserReadCache;
  classReadCache: ClassReadCache;
  loggingProvider: ILoggingDriver;
  studentReadCache: StudentReadCache;
  userReadProvider: UserReadProvider;
  guardianReadCache: GuardianReadCache;
  userCreateProvider: UserCreateProvider;
  subjectReadProvider: SubjectReadProvider;
  studentCreateProvider: StudentCreateProvider;
  guardianCreateProvider: GuardianCreateProvider;
  guardianUpdateProvider: GuardianUpdateProvider;
  classDivisionReadProvider: ClassDivisionReadProvider;

  constructor(
    userReadCache: UserReadCache,
    classReadCache: ClassReadCache,
    studentReadCache: StudentReadCache,
    userReadProvider: UserReadProvider,
    guardianReadCache: GuardianReadCache,
    userCreateProvider: UserCreateProvider,
    subjectReadProvider: SubjectReadProvider,
    studentCreateProvider: StudentCreateProvider,
    guardianCreateProvider: GuardianCreateProvider,
    guardianUpdateProvider: GuardianUpdateProvider,
    classDivisionReadProvider: ClassDivisionReadProvider
  ) {
    super(StudentCreateService.serviceName);
    this.userReadCache = userReadCache;
    this.classReadCache = classReadCache;
    this.userReadProvider = userReadProvider;
    this.studentReadCache = studentReadCache;
    this.guardianReadCache = guardianReadCache;
    this.userCreateProvider = userCreateProvider;
    this.subjectReadProvider = subjectReadProvider;
    this.studentCreateProvider = studentCreateProvider;
    this.guardianCreateProvider = guardianCreateProvider;
    this.guardianUpdateProvider = guardianUpdateProvider;
    this.classDivisionReadProvider = classDivisionReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const criteria = { tenantId: args.body.tenantId, admissionNo: args.body.admissionNo };

      // Check if student exists
      const foundStudent = await this.studentReadCache.getOneByCriteria(criteria);

      if (foundStudent) {
        throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(STUDENT_RESOURCE));
      }

      // Check if any guardian emails already exist as users
      if (args.body.guardians?.length) {
        for (const guardianData of args.body.guardians) {
          const existingGuardian = await this.userReadCache.getOneByCriteria({
            tenantId: args.body.tenantId,
            email: guardianData.email,
          });

          if (existingGuardian) {
            throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(GUARDIAN_RESOURCE));
          }
        }
      }

      const defaultHashedPassword = PasswordEncryptionService.hashPassword(ServerConfig.Params.Security.DefaultPassword.Student);

      const userCreateArgs = { ...args.body, password: defaultHashedPassword, userType: UserType.STUDENT };

      const createdStudentUser = await this.createUserStudentAndGuardianTransaction(userCreateArgs);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(STUDENT_RESOURCE), createdStudentUser);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async createBulk(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId, students } = args.body;

      const hashedPassword = PasswordEncryptionService.hashPassword(ServerConfig.Params.Security.DefaultPassword.Student);

      const processedStudents = [];

      for (const student of students) {
        const { className, classDivisionName, ...rest } = student;

        // Get class by name and tenantId
        const classRecord = await this.classReadCache.getByCriteria({ name: className, tenantId });

        if (!classRecord || classRecord.length === 0) {
          throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(CLASS_RESOURCE));
        }

        const classId = classRecord[0].id;

        // Get class division by name, classId, and tenantId
        const classDivision = await this.classDivisionReadProvider.getOneByCriteria({
          name: classDivisionName,
          classId,
          tenantId,
        });

        if (!classDivision) {
          throw new BadRequestError(`Class division "${classDivisionName}" not found under class "${className}".`);
        }

        const classDivisionId = classDivision.id;

        processedStudents.push({
          ...rest,
          classId,
          classDivisionId,
          password: hashedPassword,
          userType: UserType.STUDENT,
          tenantId,
        });
      }

      const createdStudentUser = await this.createBulkUserAndStudentTransaction(processedStudents, tenantId);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(STUDENT_RESOURCE), createdStudentUser);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || 500, error.message || "An error occurred during student creation.");
      return this.result;
    }
  }

  private async createUserStudentAndGuardianTransaction(args: StudentCreateRequestType & { password: string; userType: UserType }) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        // Update or create guardians and collect their IDs
        const guardianIds: number[] = [];
        if (args.guardians?.length) {
          const guardianData = args.guardians.map((guardian) => ({
            ...guardian,
            tenantId: args.tenantId,
          }));

          for (const guardian of guardianData) {
            const foundGuardian = await this.guardianReadCache.getOneByCriteria({
              email: guardian.email,
              tenantId: args.tenantId,
            });

            if (foundGuardian) {
              guardianIds.push(foundGuardian.id);
              continue;
            }

            if (!guardian.id) {
              const newGuardian = await this.guardianCreateProvider.create(guardian, tx);
              guardianIds.push(newGuardian.id);
            } else {
              const updatedGuardian = await this.guardianUpdateProvider.update(guardian as GuardianUpdateRequestType, tx);
              guardianIds.push(updatedGuardian.id);
            }
          }
        }

        const user = await this.userCreateProvider.create(args, tx);
        await this.userReadCache.invalidate(args.tenantId);

        const studentArgs = {
          guardianIds,
          userId: user.id,
          classId: args.classId,
          tenantId: args.tenantId,
          bloodGroup: args.bloodGroup,
          dormitoryId: args.dormitoryId,
          admissionNo: args.admissionNo,
          enrollmentDate: args.enrollmentDate,
          studentGroupIds: args.studentGroupIds,
          classDivisionId: args.classDivisionId,
        };

        const student = await this.studentCreateProvider.create(studentArgs, tx);
        await this.studentReadCache.invalidate(args.tenantId);

        return student;
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }

  private async createBulkUserAndStudentTransaction(args: (StudentCreateRequestType & { password: string; userType: UserType })[], tenantId: number) {
    try {
      await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const userArgs = args.map((student) => ({
          tenantId,
          email: student.email,
          gender: student.gender,
          lastName: student.lastName,
          password: student.password,
          userType: student.userType,
          firstName: student.firstName,
        }));

        await this.userCreateProvider.createMany(userArgs, tx);
        await this.userReadCache.invalidate(tenantId);

        const emails = args.map((s) => s.email);
        const foundUsers = await this.userReadProvider.getByCriteria({ tenantId, emails }, tx);

        const userMap = new Map(foundUsers?.map((user) => [user.email, user.id]));

        const studentData = args.map((student) => ({
          tenantId: tenantId,
          classId: student.classId,
          admissionNo: student.admissionNo,
          userId: userMap.get(student.email)!,
          classDivisionId: student.classDivisionId,
        }));

        await this.studentCreateProvider.createMany(studentData, tx);
        await this.studentReadCache.invalidate(tenantId);
      });
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
