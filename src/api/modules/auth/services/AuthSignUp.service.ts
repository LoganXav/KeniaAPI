import { DateTime } from "luxon";
import { autoInjectable } from "tsyringe";
import { TokenType } from "@prisma/client";
import Event from "~/api/shared/helpers/events";
import TokenProvider from "../providers/Token.provider";
import { businessConfig } from "~/config/BusinessConfig";
import DbClient from "~/infrastructure/internal/database";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { JwtService } from "~/api/shared/services/jwt/Jwt.service";
import { generateStringOfLength } from "~/utils/GenerateStringOfLength";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { eventTypes } from "~/api/shared/helpers/enums/EventTypes.enum";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import UserInternalApiProvider from "~/api/shared/providers/user/UserInternalApi.provider";
import { CreateUserRecordType, SignUpUserType } from "~/api/shared/types/UserInternalApiTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import TenantInternalApiProvider from "~/api/shared/providers/tenant/TenantInternalApi.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { ACCOUNT_CREATED, EMAIL_IN_USE, ERROR, SOMETHING_WENT_WRONG, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import UserReadProvider from "~/api/shared/providers/user/UserRead.provider";

@autoInjectable()
export default class AuthSignUpService extends BaseService<CreateUserRecordType> {
  static serviceName = "AuthSignUpService";
  tokenProvider: TokenProvider;
  userInternalApiProvider: UserInternalApiProvider;
  userReadProvider: UserReadProvider;
  tenantInternalApiProvider: TenantInternalApiProvider;
  loggingProvider: ILoggingDriver;

  constructor(tokenProvider: TokenProvider, userInternalApiProvider: UserInternalApiProvider, tenantInternalApiProvider: TenantInternalApiProvider, userReadProvider: UserReadProvider) {
    super(AuthSignUpService.serviceName);
    this.tokenProvider = tokenProvider;
    this.userReadProvider = userReadProvider;
    this.userInternalApiProvider = userInternalApiProvider;
    this.tenantInternalApiProvider = tenantInternalApiProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: CreateUserRecordType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["password"]);
      const foundUser = await this.userReadProvider.getOneByCriteria({ email: args.email });
      console.log(foundUser);
      if (foundUser) {
        throw new BadRequestError(EMAIL_IN_USE);
      }

      return this.result;

      const hashedPassword = PasswordEncryptionService.hashPassword(args.password);

      const input = { ...args, password: hashedPassword };

      const data = await this.createTenantAndUserRecordWithTokenTransaction(input);

      const { user, otpToken } = data;

      Event.emit(eventTypes.user.signUp, {
        userEmail: user.email,
        activationToken: otpToken,
      });

      const accessToken = await JwtService.getJwt(user);

      const { password, ...createdUserData } = user;

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, ACCOUNT_CREATED, createdUserData, accessToken);

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
      const result = await DbClient.$transaction(async (tx) => {
        const tenant = await this.tenantInternalApiProvider.createTenantRecord(tx);

        const input = { tenantId: tenant?.id, ...args };

        const user = await this.userInternalApiProvider.createUserRecord(input, tx);

        const otpToken = generateStringOfLength(businessConfig.emailTokenLength);
        const expiresAt = DateTime.now().plus({ minutes: businessConfig.emailTokenExpiresInMinutes }).toJSDate();

        await this.tokenProvider.createUserTokenRecord(
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
