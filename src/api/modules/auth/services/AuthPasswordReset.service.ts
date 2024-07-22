import { autoInjectable } from "tsyringe";
import { UserToken } from "@prisma/client";
import DateTimeUtil from "~/utils/DateTimeUtil";
import TokenProvider from "../providers/Token.provider";
import DbClient from "~/infrastructure/internal/database";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "../../base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import UserReadProvider from "~/api/shared/providers/user/UserRead.provider";
import UserUpdateProvider from "~/api/shared/providers/user/UserUpdate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { ERROR, ERROR_EXPIRED_TOKEN, ERROR_INVALID_TOKEN, NULL_OBJECT, PASSWORD_RESET_SUCCESSFULLY, SOMETHING_WENT_WRONG, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class AuthPasswordResetService extends BaseService<IRequest> {
  static serviceName = "AuthPasswordResetService";
  tokenProvider: TokenProvider;
  loggingProvider: ILoggingDriver;
  userReadProvider: UserReadProvider;
  userUpdateProvider: UserUpdateProvider;
  constructor(tokenProvider: TokenProvider, userReadProvider: UserReadProvider, userUpdateProvider: UserUpdateProvider) {
    super(AuthPasswordResetService.serviceName);
    this.tokenProvider = tokenProvider;
    this.userReadProvider = userReadProvider;
    this.userUpdateProvider = userUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }
  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace);

      const { token } = args.params;
      const { password } = args.body;

      const dbResetToken = await this.tokenProvider.getOneByCriteria({ token });

      if (dbResetToken === NULL_OBJECT) {
        throw new BadRequestError(ERROR_INVALID_TOKEN);
      }

      const foundUser = await this.userReadProvider.getOneByCriteria({ id: dbResetToken.userId });

      if (foundUser === NULL_OBJECT) {
        await this.deactivateUserToken(dbResetToken.id);

        throw new BadRequestError(ERROR_INVALID_TOKEN);
      }

      if (dbResetToken.expired || this.checkTokenExpired(dbResetToken.expiresAt)) {
        await this.deactivateUserToken(dbResetToken.id);

        throw new BadRequestError(ERROR_EXPIRED_TOKEN);
      }

      await this.passwordResetConfirmTransaction(dbResetToken, password);

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, PASSWORD_RESET_SUCCESSFULLY);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);

      return this.result;
    }
  }

  private async passwordResetConfirmTransaction(dbResetToken: UserToken, password: string) {
    try {
      const result = await DbClient.$transaction(async (tx: any) => {
        const updateUserRecordPayload = {
          userId: dbResetToken.userId,
          password: PasswordEncryptionService.hashPassword(password),
        };
        await this.userUpdateProvider.updateOneByCriteria(updateUserRecordPayload, tx);
        await this.deactivateUserToken(dbResetToken.id, tx);

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

  private checkTokenExpired(tokenExpiryDate: Date) {
    return DateTimeUtil.getCurrentDate() > tokenExpiryDate;
  }
}
