import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { SUCCESS, SOMETHING_WENT_WRONG, ALREADY_EXISTS, CREATED } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StudentCreateProvider from "../providers/StudentCreate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { StudentCreateRequestType } from "../types/StudentTypes";
import UserReadProvider from "../../user/providers/UserRead.provider";
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

@autoInjectable()
export default class StudentCreateService extends BaseService<IRequest> {
  static serviceName = "StudentCreateService";
  studentCreateProvider: StudentCreateProvider;
  userReadProvider: UserReadProvider;
  userCreateProvider: UserCreateProvider;
  loggingProvider: ILoggingDriver;
  studentReadCache: StudentReadCache;
  userReadCache: UserReadCache;

  constructor(studentCreateProvider: StudentCreateProvider, userReadProvider: UserReadProvider, userCreateProvider: UserCreateProvider, studentReadCache: StudentReadCache, userReadCache: UserReadCache) {
    super(StudentCreateService.serviceName);
    this.studentCreateProvider = studentCreateProvider;
    this.userReadProvider = userReadProvider;
    this.userCreateProvider = userCreateProvider;
    this.studentReadCache = studentReadCache;
    this.userReadCache = userReadCache;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const criteria = { tenantId: args.body.tenantId, email: args.body.email };

      const foundUser = await this.userReadCache.getOneByCriteria(criteria);
      if (foundUser) {
        throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(ALREADY_EXISTS));
      }

      const hashedPassword = PasswordEncryptionService.hashPassword(ServerConfig.Params.Security.DefaultPassword.Student);

      const userCreateArgs = { ...args.body, password: hashedPassword, userType: UserType.STUDENT };

      const createdStudentUser = await this.createUserAndStudentTransaction(userCreateArgs);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(CREATED), createdStudentUser);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async createUserAndStudentTransaction(args: StudentCreateRequestType & { password: string; userType: UserType }) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const user = await this.userCreateProvider.create(args, tx);
        await this.userReadCache.invalidate(args.tenantId);

        const studentArgs = { ...args, userId: user.id };

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
