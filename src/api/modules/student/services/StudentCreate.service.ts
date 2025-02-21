import { autoInjectable } from "tsyringe";
import ServerConfig from "~/config/ServerConfig";
import { UserType } from "@prisma/client";
import StudentReadCache from "../cache/StudentRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
import UserReadCache from "../../user/cache/UserRead.cache";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { StudentCreateRequestType } from "../types/StudentTypes";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import GuardianReadCache from "../../guardian/cache/GuardianRead.cache";
import StudentCreateProvider from "../providers/StudentCreate.provider";
import UserCreateProvider from "../../user/providers/UserCreate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import GuardianCreateProvider from "../../guardian/providers/GuardianCreate.provider";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { SUCCESS, SOMETHING_WENT_WRONG, STUDENT_RESOURCE, GUARDIAN_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_ALREADY_EXISTS, RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
@autoInjectable()
export default class StudentCreateService extends BaseService<IRequest> {
  static serviceName = "StudentCreateService";
  userReadCache: UserReadCache;
  loggingProvider: ILoggingDriver;
  studentReadCache: StudentReadCache;
  guardianReadCache: GuardianReadCache;
  userCreateProvider: UserCreateProvider;
  studentCreateProvider: StudentCreateProvider;
  guardianCreateProvider: GuardianCreateProvider;

  constructor(studentCreateProvider: StudentCreateProvider, userCreateProvider: UserCreateProvider, studentReadCache: StudentReadCache, userReadCache: UserReadCache, guardianCreateProvider: GuardianCreateProvider, guardianReadCache: GuardianReadCache) {
    super(StudentCreateService.serviceName);
    this.userReadCache = userReadCache;
    this.studentReadCache = studentReadCache;
    this.guardianReadCache = guardianReadCache;
    this.userCreateProvider = userCreateProvider;
    this.studentCreateProvider = studentCreateProvider;
    this.guardianCreateProvider = guardianCreateProvider;
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
        // Create guardians if guardian data is provided
        let guardians: { id: number }[] = [];
        if (args.guardians?.length) {
          const guardianData = args.guardians.map((guardian) => ({
            ...guardian,
            tenantId: args.tenantId,
          }));

          guardians = await this.guardianCreateProvider.createMany(guardianData, tx);
        }

        await this.guardianReadCache.invalidate(args.tenantId);

        const user = await this.userCreateProvider.create(args, tx);
        await this.userReadCache.invalidate(args.tenantId);

        const studentArgs = {
          userId: user.id,
          classId: args.classId,
          tenantId: args.tenantId,
          bloodGroup: args.bloodGroup,
          dormitoryId: args.dormitoryId,
          studentGroupIds: args.studentGroupIds,
          enrollmentDate: args.enrollmentDate || new Date(),
          guardianIds: guardians?.map((guardian) => guardian.id) || [],
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
