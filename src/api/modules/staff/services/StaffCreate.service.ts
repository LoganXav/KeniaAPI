import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { SUCCESS, STAFF_RESOURCE, SOMETHING_WENT_WRONG } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StaffCreateProvider from "../providers/StaffCreate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { StaffCreateRequestType } from "../types/StaffTypes";
import UserReadProvider from "../../user/providers/UserRead.provider";
import { RESOURCE_RECORD_ALREADY_EXISTS, RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import ServerConfig from "~/config/ServerConfig";
import UserCreateProvider from "../../user/providers/UserCreate.provider";
import { UserType } from "@prisma/client";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";

@autoInjectable()
export default class StaffCreateService extends BaseService<StaffCreateRequestType> {
  static serviceName = "StaffCreateService";
  staffCreateProvider: StaffCreateProvider;
  userReadProvider: UserReadProvider;
  userCreateProvider: UserCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(staffCreateProvider: StaffCreateProvider, userReadProvider: UserReadProvider, userCreateProvider: UserCreateProvider) {
    super(StaffCreateService.serviceName);
    this.staffCreateProvider = staffCreateProvider;
    this.userReadProvider = userReadProvider;
    this.userCreateProvider = userCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: StaffCreateRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["createStaffUser"]);

      const foundUser = await this.userReadProvider.getOneByCriteria({ email: args.email });
      if (foundUser) {
        throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(STAFF_RESOURCE));
      }

      const hashedPassword = PasswordEncryptionService.hashPassword(ServerConfig.Params.Security.DefaultPassword.Staff);

      const userCreateArgs = { ...args, password: hashedPassword, userType: UserType.STAFF };

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

        const userArgs = { ...args, userId: user.id };

        const staff = await this.staffCreateProvider.create(userArgs, tx);

        return staff;
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
