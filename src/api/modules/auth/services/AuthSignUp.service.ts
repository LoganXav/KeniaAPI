import { DateTime } from "luxon";
import { autoInjectable } from "tsyringe";
import Event from "~/api/shared/helpers/events";
import { TokenType, UserType } from "@prisma/client";
import TokenProvider from "../providers/Token.provider";
import { businessConfig } from "~/config/BusinessConfig";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { generateStringOfLength } from "~/utils/GenerateStringOfLength";
import { eventTypes } from "~/api/shared/helpers/enums/EventTypes.enum";
import UserReadProvider from "~/api/modules/user/providers/UserRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import UserCreateProvider from "~/api/modules/user/providers/UserCreate.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import TenantCreateProvider from "~/api/modules/tenant/providers/TenantCreate.provider";
import { CreateUserRecordType, SignUpUserType } from "~/api/modules/user/types/UserTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { ACCOUNT_CREATED, EMAIL_IN_USE, ERROR, SCHOOL_OWNER_ROLE_NAME, SCHOOL_OWNER_ROLE_RANK, SOMETHING_WENT_WRONG, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import RoleCreateProvider from "../../role/providers/RoleCreate.provider";
import StaffCreateProvider from "../../staff/providers/StaffCreate.provider";
@autoInjectable()
export default class AuthSignUpService extends BaseService<CreateUserRecordType> {
  static serviceName = "AuthSignUpService";
  tokenProvider: TokenProvider;
  loggingProvider: ILoggingDriver;
  userReadProvider: UserReadProvider;
  userCreateProvider: UserCreateProvider;
  tenantCreateProvider: TenantCreateProvider;
  roleCreateProvider: RoleCreateProvider;
  staffCreateProvider: StaffCreateProvider;

  constructor(tokenProvider: TokenProvider, userReadProvider: UserReadProvider, tenantCreateProvider: TenantCreateProvider, userCreateProvider: UserCreateProvider, roleCreateProvider: RoleCreateProvider, staffCreateProvider: StaffCreateProvider) {
    super(AuthSignUpService.serviceName);
    this.tokenProvider = tokenProvider;
    this.userReadProvider = userReadProvider;
    this.userCreateProvider = userCreateProvider;
    this.tenantCreateProvider = tenantCreateProvider;
    this.roleCreateProvider = roleCreateProvider;
    this.staffCreateProvider = staffCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: CreateUserRecordType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["password"]);
      const foundUser = await this.userReadProvider.getOneByCriteria({ email: args.email });
      if (foundUser) {
        throw new BadRequestError(EMAIL_IN_USE);
      }

      const hashedPassword = PasswordEncryptionService.hashPassword(args.password);

      const input = { ...args, password: hashedPassword };

      const data = await this.createTenantAndUserRecordWithTokenTransaction(input);

      const { user, otpToken } = data;

      Event.emit(eventTypes.user.signUp, {
        userEmail: user.email,
        activationToken: otpToken,
      });

      const signUpUserData = { id: user.id, tenantId: user.tenantId };

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, ACCOUNT_CREATED, signUpUserData);

      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async createTenantAndUserRecordWithTokenTransaction(args: SignUpUserType) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const tenant = await this.tenantCreateProvider.create(null, tx);

        const userCreateInput = { tenantId: tenant?.id, ...args, userType: UserType.STAFF };
        const user = await this.userCreateProvider.create(userCreateInput, tx);

        const roleCreateInput = { name: SCHOOL_OWNER_ROLE_NAME, rank: SCHOOL_OWNER_ROLE_RANK, permissions: [], tenantId: tenant?.id };
        const role = await this.roleCreateProvider.createRole(roleCreateInput, tx);

        const staffCreateInput = { jobTitle: SCHOOL_OWNER_ROLE_NAME, userId: user?.id, roleId: role?.id, tenantId: tenant?.id };
        await this.staffCreateProvider.create(staffCreateInput, tx);

        const otpToken = generateStringOfLength(businessConfig.emailTokenLength);
        const expiresAt = DateTime.now().plus({ minutes: businessConfig.emailTokenExpiresInMinutes }).toJSDate();

        await this.tokenProvider.create(
          {
            userId: user.id,
            tokenType: TokenType.EMAIL,
            expiresAt,
            token: otpToken,
          },
          tx
        );

        return { user, otpToken };
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
