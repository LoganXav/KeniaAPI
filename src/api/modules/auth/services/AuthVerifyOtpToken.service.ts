import { autoInjectable } from "tsyringe";
import DateTimeUtil from "~/utils/DateTimeUtil";
import { TokenType, UserToken } from "@prisma/client";
import TokenProvider from "../providers/Token.provider";
import DbClient from "~/infrastructure/internal/database";
import { BaseService } from "../../base/services/Base.service";
import { JwtService } from "~/api/shared/services/jwt/Jwt.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import UserReadProvider from "~/api/shared/providers/user/UserRead.provider";
import { VerifyUserTokenType } from "~/api/shared/types/UserInternalApiTypes";
import UserUpdateProvider from "~/api/shared/providers/user/UserUpdate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ACCOUNT_VERIFIED, ERROR, ERROR_INVALID_TOKEN, NULL_OBJECT, SOMETHING_WENT_WRONG, SUCCESS, TOKEN_EXPIRED, TOKEN_VERIFIED } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class AuthVerifyOtpTokenService extends BaseService<VerifyUserTokenType> {
  static serviceName = "AuthVerifyOtpTokenService";
  tokenProvider: TokenProvider;
  userReadProvider: UserReadProvider;
  userUpdateProvider: UserUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(tokenProvider: TokenProvider, userReadProvider: UserReadProvider, userUpdateProvider: UserUpdateProvider) {
    super(AuthVerifyOtpTokenService.serviceName);
    this.tokenProvider = tokenProvider;
    this.userReadProvider = userReadProvider;
    this.userUpdateProvider = userUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: VerifyUserTokenType) {
    try {
      const { id: userId, otpToken } = args;
      this.initializeServiceTrace(trace, args, ["otpToken"]);

      if (!otpToken) {
        throw new BadRequestError(ERROR_INVALID_TOKEN);
      }

      const dbOtpToken = await this.tokenProvider.getOneByCriteria({ token: otpToken });
      if (dbOtpToken === NULL_OBJECT) {
        throw new BadRequestError(ERROR_INVALID_TOKEN);
      }

      if (dbOtpToken.tokenType != TokenType.EMAIL) {
        await this.deactivateUserToken(dbOtpToken.id);
        throw new BadRequestError(ERROR_INVALID_TOKEN);
      }

      const tokenOwner = await this.userReadProvider.getOneByCriteria({ id: userId });

      if (tokenOwner === NULL_OBJECT) {
        throw new BadRequestError(ERROR_INVALID_TOKEN);
      }

      if (tokenOwner.id !== userId) {
        throw new BadRequestError(ERROR_INVALID_TOKEN);
      }

      const accessToken = await JwtService.getJwt(tokenOwner);
      const { password, ...verifyUserData } = tokenOwner;

      if (tokenOwner.hasVerified) {
        this.result.setData(SUCCESS, HttpStatusCodeEnum.ACCEPTED, ACCOUNT_VERIFIED, verifyUserData, accessToken);
        trace.setSuccessful();
        return this.result;
      }

      if (dbOtpToken.expired || this.checkTokenExpired(dbOtpToken.expiresAt)) {
        await this.deactivateUserToken(dbOtpToken.id);

        throw new BadRequestError(TOKEN_EXPIRED);
      }

      await this.verifyUserAccountTransaction(dbOtpToken, userId);

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, TOKEN_VERIFIED, verifyUserData, accessToken);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async verifyUserAccountTransaction(dbOtpToken: UserToken, userId: number) {
    try {
      const result = await DbClient.$transaction(async (tx) => {
        await this.verifyUserAccount(userId, tx);
        await this.deactivateUserToken(dbOtpToken.id, tx);

        return;
      });

      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }

  private async deactivateUserToken(tokenId: number, tx?: any) {
    const updateUserTokenRecordArgs = {
      tokenId,
      expired: true,
      isActive: false,
    };
    await this.tokenProvider.updateOneByCriteria(updateUserTokenRecordArgs, tx);
  }

  private async verifyUserAccount(userId: number, tx?: any) {
    const verifyUserAccountArgs = {
      userId,
      hasVerified: true,
    };
    await this.userUpdateProvider.updateOneByCriteria(verifyUserAccountArgs, tx);
  }

  private checkTokenExpired(tokenExpiryDate: Date) {
    return DateTimeUtil.getCurrentDate() > tokenExpiryDate;
  }
}
