import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { BaseService } from "../../base/services/Base.service"
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver"
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory"
import { IResult } from "~/api/shared/helpers/results/IResult"
import {
  ERROR,
  ERROR_EXPIRED_TOKEN,
  ERROR_INVALID_TOKEN,
  NULL_OBJECT,
  PASSWORD_RESET_SUCCESSFULLY,
  SOMETHING_WENT_WRONG,
  SUCCESS
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { IRequest } from "~/infrastructure/internal/types"
import TokenProvider from "../providers/Token.provider"
import { autoInjectable } from "tsyringe"
import UserInternalApiProvider from "~/api/shared/providers/user/UserInternalApi.provider"
import { UserToken } from "@prisma/client"
import DbClient from "~/infrastructure/internal/database"
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service"
import DateTimeUtil from "~/utils/DateTimeUtil"
import { UpdateUserTokenActivationRecordType } from "~/api/shared/types/UserInternalApiTypes"
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError"
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError"

@autoInjectable()
export default class AuthPasswordResetService extends BaseService<IRequest> {
  static serviceName = "AuthPasswordResetService"
  loggingProvider: ILoggingDriver
  tokenProvider: TokenProvider
  userInternalApiProvider: UserInternalApiProvider
  constructor(
    tokenProvider: TokenProvider,
    userInternalApiProvider: UserInternalApiProvider
  ) {
    super(AuthPasswordResetService.serviceName)
    this.loggingProvider = LoggingProviderFactory.build()
    this.tokenProvider = tokenProvider
    this.userInternalApiProvider = userInternalApiProvider
  }
  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace)

      const { token } = args.params
      const { password } = args.body

      const dbResetToken = await this.tokenProvider.findUserTokenByToken(token)

      if (dbResetToken === NULL_OBJECT) {
        throw new BadRequestError(ERROR_INVALID_TOKEN)
      }

      const foundUser = await this.userInternalApiProvider.findUserById(
        dbResetToken.userId
      )

      if (foundUser === NULL_OBJECT) {
        await this.deactivateUserToken(dbResetToken.id)

        throw new BadRequestError(ERROR_INVALID_TOKEN)
      }

      if (
        dbResetToken.expired ||
        this.checkTokenExpired(dbResetToken.expiresAt)
      ) {
        await this.deactivateUserToken(dbResetToken.id)

        throw new BadRequestError(ERROR_EXPIRED_TOKEN)
      }

      await this.passwordResetConfirmTransaction(dbResetToken, password)

      this.result.setData(
        SUCCESS,
        HttpStatusCodeEnum.SUCCESS,
        PASSWORD_RESET_SUCCESSFULLY
      )
      trace.setSuccessful()
      return this.result
    } catch (error: any) {
      this.loggingProvider.error(error)
      this.result.setError(ERROR, error.httpStatusCode, error.description)

      return this.result
    }
  }

  private async passwordResetConfirmTransaction(
    dbResetToken: UserToken,
    password: string
  ) {
    try {
      const result = await DbClient.$transaction(async (tx: any) => {
        const updateUserRecordPayload = {
          userId: dbResetToken.userId,
          password: PasswordEncryptionService.hashPassword(password)
        }
        await this.userInternalApiProvider.updateUserPassword(
          updateUserRecordPayload,
          tx
        )
        await this.deactivateUserToken(dbResetToken.id, tx)

        return
      })
      return result
    } catch (error: any) {
      this.loggingProvider.error(error)
      throw new InternalServerError(SOMETHING_WENT_WRONG)
    }
  }

  private async deactivateUserToken(tokenId: number, tx?: any) {
    const updateUserTokenRecordArgs: UpdateUserTokenActivationRecordType = {
      tokenId,
      expired: true,
      isActive: false
    }
    await this.tokenProvider.updateUserTokenRecord(
      updateUserTokenRecordArgs,
      tx
    )
  }

  private checkTokenExpired(tokenExpiryDate: Date) {
    return DateTimeUtil.getCurrentDate() > tokenExpiryDate
  }
}
