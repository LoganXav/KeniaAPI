import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { SUCCESS, SOMETHING_WENT_WRONG, ALREADY_EXISTS, CREATED, STUDENT_RESOURCE, GUARDIAN_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StudentCreateProvider from "../providers/StudentCreate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { StudentCreateRequestType } from "../types/StudentTypes";
import { RESOURCE_RECORD_ALREADY_EXISTS, RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import ServerConfig from "~/config/ServerConfig";
import UserCreateProvider from "../../user/providers/UserCreate.provider";
import { UserType } from "@prisma/client";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { IRequest } from "~/infrastructure/internal/types";
import StudentReadCache from "../cache/StudentRead.cache";
import UserReadCache from "../../user/cache/UserRead.cache";
import GuardianCreateProvider from "../../guardian/providers/GuardianCreate.provider";
import GuardianReadCache from "../../guardian/cache/GuardianRead.cache";
@autoInjectable()
export default class StudentCreateService extends BaseService<IRequest> {
  static serviceName = "StudentCreateService";
  studentCreateProvider: StudentCreateProvider;
  userCreateProvider: UserCreateProvider;
  loggingProvider: ILoggingDriver;
  studentReadCache: StudentReadCache;
  userReadCache: UserReadCache;
  guardianCreateProvider: GuardianCreateProvider;
  guardianReadCache: GuardianReadCache;

  constructor(studentCreateProvider: StudentCreateProvider, userCreateProvider: UserCreateProvider, studentReadCache: StudentReadCache, userReadCache: UserReadCache, guardianCreateProvider: GuardianCreateProvider, guardianReadCache: GuardianReadCache) {
    super(StudentCreateService.serviceName);
    this.studentCreateProvider = studentCreateProvider;
    this.userCreateProvider = userCreateProvider;
    this.studentReadCache = studentReadCache;
    this.userReadCache = userReadCache;
    this.guardianCreateProvider = guardianCreateProvider;
    this.guardianReadCache = guardianReadCache;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const criteria = { tenantId: args.body.tenantId, email: args.body.email };

      // Check if student exists
      const foundUser = await this.userReadCache.getOneByCriteria(criteria);
      if (foundUser) {
        throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(STUDENT_RESOURCE));
      }

      // Check if any guardian emails already exist
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

  private async createUserStudentAndGuardianTransaction(args: StudentCreateRequestType & { password: string; userType: UserType }) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        // Create guardians first if guardian data is provided
        const guardianIds: number[] = [];

        if (args.guardians?.length) {
          for (const guardianData of args.guardians) {
            const guardian = await this.guardianCreateProvider.create(
              {
                ...guardianData,
                tenantId: args.tenantId,
              },
              tx
            );
            guardianIds.push(guardian.id);
          }
        }
        await this.guardianReadCache.invalidate(args.tenantId);

        const user = await this.userCreateProvider.create(args, tx);
        await this.userReadCache.invalidate(args.tenantId);

        const studentArgs = {
          userId: user.id,
          tenantId: args.tenantId,
          classId: args.classId,
          admissionNo: args.admissionNo,
          studentGroupIds: args.studentGroupIds,
          currentGrade: args.currentGrade,
          languages: args.languages,
          religion: args.religion,
          bloodGroup: args.bloodGroup,
          previousSchool: args.previousSchool,
          enrollmentDate: args.enrollmentDate || new Date(),
          dormitoryId: args.dormitoryId,
          guardianIds,
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
}
