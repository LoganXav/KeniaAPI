import { DateTime } from "luxon";
import { autoInjectable } from "tsyringe";
import { TokenType, User } from "@prisma/client";
import TokenProvider from "../providers/Token.provider";
import { businessConfig } from "~/config/BusinessConfig";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { generateStringOfLength } from "~/utils/GenerateStringOfLength";
import { EmailService } from "~/api/shared/services/email/Email.service";
import { RefreshUserTokenType } from "~/api/modules/user/types/UserTypes";
import UserReadProvider from "~/api/modules/user/providers/UserRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ACCOUNT_VERIFIED, TOKEN_REFRESH_SUCCESS, ERROR, NULL_OBJECT, SUCCESS, SOMETHING_WENT_WRONG, USER_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class AuthRefreshOtpTokenService extends BaseService<RefreshUserTokenType> {
  static serviceName = "AuthRefreshOtpTokenService";
  tokenProvider: TokenProvider;
  userReadProvider: UserReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(tokenProvider: TokenProvider, userReadProvider: UserReadProvider) {
    super(AuthRefreshOtpTokenService.serviceName);
    this.tokenProvider = tokenProvider;
    this.userReadProvider = userReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: RefreshUserTokenType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const foundUser = await this.userReadProvider.getOneByCriteria({ email: args.email });

      if (foundUser === NULL_OBJECT) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(USER_RESOURCE));
      }

      if (foundUser.hasVerified) {
        this.result.setData(SUCCESS, HttpStatusCodeEnum.ACCEPTED, ACCOUNT_VERIFIED);
        trace.setSuccessful();
        return this.result;
      }

      const otpToken = await this.authRefreshTokenTransaction(foundUser);

      await EmailService.sendAccountActivationEmail({
        userEmail: foundUser.email,
        activationToken: otpToken,
      });

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, TOKEN_REFRESH_SUCCESS);

      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async authRefreshTokenTransaction(foundUser: User) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const userTokens = await this.tokenProvider.getByCriteria(
          {
            userId: foundUser.id,
            tokenType: TokenType.EMAIL,
          },
          tx
        );

        if (userTokens) {
          for (const token of userTokens) {
            await this.deactivateUserToken(token.id, tx);
          }
        }

        const otpToken = generateStringOfLength(businessConfig.emailTokenLength);

        const expiresAt = DateTime.now().plus({ minutes: businessConfig.emailTokenExpiresInMinutes }).toJSDate();

        await this.tokenProvider.create(
          {
            userId: foundUser.id,
            tokenType: TokenType.EMAIL,
            expiresAt,
            token: otpToken,
          },
          tx
        );

        return otpToken;
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }

  private async deactivateUserToken(tokenId: number, tx: PrismaTransactionClient) {
    const updateUserTokenRecordArgs = {
      tokenId,
      expired: true,
      isActive: false,
    };
    await this.tokenProvider.updateOneByCriteria(updateUserTokenRecordArgs, tx);
  }
}
