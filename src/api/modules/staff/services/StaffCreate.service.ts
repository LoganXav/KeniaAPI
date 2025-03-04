import { autoInjectable } from "tsyringe";
import { UserType } from "@prisma/client";
import ServerConfig from "~/config/ServerConfig";
import StaffReadCache from "../cache/StaffRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
import UserReadCache from "../../user/cache/UserRead.cache";
import { StaffCreateRequestType } from "../types/StaffTypes";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import StaffCreateProvider from "../providers/StaffCreate.provider";
import { ERROR, SUBJECT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import UserReadProvider from "../../user/providers/UserRead.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import UserCreateProvider from "../../user/providers/UserCreate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { SUCCESS, STAFF_RESOURCE, SOMETHING_WENT_WRONG } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_ALREADY_EXISTS, RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import SubjectReadProvider from "../../subject/providers/SubjectRead.provider";

@autoInjectable()
export default class StaffCreateService extends BaseService<IRequest> {
  static serviceName = "StaffCreateService";
  staffCreateProvider: StaffCreateProvider;
  userReadProvider: UserReadProvider;
  userCreateProvider: UserCreateProvider;
  loggingProvider: ILoggingDriver;
  staffReadCache: StaffReadCache;
  userReadCache: UserReadCache;
  subjectReadProvider: SubjectReadProvider;
  constructor(staffCreateProvider: StaffCreateProvider, userReadProvider: UserReadProvider, userCreateProvider: UserCreateProvider, staffReadCache: StaffReadCache, userReadCache: UserReadCache, subjectReadProvider: SubjectReadProvider) {
    super(StaffCreateService.serviceName);
    this.staffCreateProvider = staffCreateProvider;
    this.userReadProvider = userReadProvider;
    this.userCreateProvider = userCreateProvider;
    this.staffReadCache = staffReadCache;
    this.userReadCache = userReadCache;
    this.subjectReadProvider = subjectReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const criteria = { tenantId: args.body.tenantId, email: args.body.email };

      const foundUser = await this.userReadCache.getOneByCriteria(criteria);
      if (foundUser) {
        throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(STAFF_RESOURCE));
      }

      // Validate subjectIds within the transaction
      if (args.body.subjectIds?.length) {
        const validSubjects = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId });
        const validSubjectIds = validSubjects.map((subject) => subject.id);
        const invalidSubjectIds = args.body.subjectIds.filter((id: number) => !validSubjectIds.includes(id));

        if (invalidSubjectIds.length > 0) {
          throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(SUBJECT_RESOURCE));
        }
      }

      const hashedPassword = PasswordEncryptionService.hashPassword(ServerConfig.Params.Security.DefaultPassword.Staff);

      const userCreateArgs = { ...args.body, password: hashedPassword, userType: UserType.STAFF };

      const createdStaffUser = await this.createUserAndStaffTransaction(userCreateArgs);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(STAFF_RESOURCE), createdStaffUser);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async createUserAndStaffTransaction(args: StaffCreateRequestType & { password: string; userType: UserType }) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const user = await this.userCreateProvider.create(args, tx);
        await this.userReadCache.invalidate(args.tenantId);

        const userArgs = {
          ...args,
          userId: user?.id,
          startDate: args.startDate ? args.startDate.toISOString() : undefined,
        };

        const staff = await this.staffCreateProvider.create(userArgs, tx);
        await this.staffReadCache.invalidate(args.tenantId);

        return staff;
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
