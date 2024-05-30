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
import ProprietorInternalApiProvider from "~/api/shared/providers/proprietor/ProprietorInternalApi"
import { UpdateUserTokenActivationRecordDTO } from "../types/AuthDTO"
import { UserToken } from "@prisma/client"
import DbClient from "~/infrastructure/internal/database"
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service"
import DateTimeUtil from "~/utils/DateTimeUtil"

@autoInjectable()
export default class AuthPasswordResetService extends BaseService<IRequest> {
  static serviceName = "AuthPasswordResetService"
  loggingProvider: ILoggingDriver
  tokenProvider: TokenProvider
  proprietorInternalApiProvider: ProprietorInternalApiProvider
  constructor(
    tokenProvider: TokenProvider,
    proprietorInternalApiProvider: ProprietorInternalApiProvider
  ) {
    super(AuthPasswordResetService.serviceName)
    this.loggingProvider = LoggingProviderFactory.build()
    this.tokenProvider = tokenProvider
    this.proprietorInternalApiProvider = proprietorInternalApiProvider
  }
  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace)

      const { token } = args.params
      const { password } = args.body

      const dbResetToken = await this.tokenProvider.findUserTokenByToken(token)

      if (dbResetToken === NULL_OBJECT) {
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.BAD_REQUEST,
          ERROR_INVALID_TOKEN
        )
        return this.result
      }

      const foundUser =
        await this.proprietorInternalApiProvider.findProprietorById(
          dbResetToken.userId
        )

      if (foundUser === NULL_OBJECT) {
        await this.deactivateUserToken(dbResetToken.id)

        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.BAD_REQUEST,
          ERROR_INVALID_TOKEN
        )
        return this.result
      }

      const data = await this.passwordResetConfirmTransaction(
        dbResetToken,
        password
      )

      if (data === NULL_OBJECT) return this.result

      this.result.setData(
        SUCCESS,
        HttpStatusCodeEnum.SUCCESS,
        PASSWORD_RESET_SUCCESSFULLY
      )
      trace.setSuccessful()
      return this.result
    } catch (error: any) {
      this.loggingProvider.error(error)
      this.result.setError(
        ERROR,
        HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        SOMETHING_WENT_WRONG
      )

      return this.result
    }
  }

  private async passwordResetConfirmTransaction(
    dbResetToken: UserToken,
    password: string
  ) {
    try {
      const result = await DbClient.$transaction(async (tx: any) => {
        if (
          dbResetToken.expired ||
          this.checkTokenExpired(dbResetToken.expiresAt)
        ) {
          await this.deactivateUserToken(dbResetToken.id, tx)

          this.result.setError(
            ERROR,
            HttpStatusCodeEnum.BAD_REQUEST,
            ERROR_EXPIRED_TOKEN
          )
          return null
        }

        const updateUserRecordPayload = {
          userId: dbResetToken.userId,
          password: PasswordEncryptionService.hashPassword(password)
        }
        await this.proprietorInternalApiProvider.updateUserPassword(
          updateUserRecordPayload,
          tx
        )
        await this.deactivateUserToken(dbResetToken.id, tx)

        return
      })
      return result
    } catch (error: any) {
      this.loggingProvider.error(error)
      this.result.setError(
        ERROR,
        HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        SOMETHING_WENT_WRONG
      )
      return null
    }
  }

  private async deactivateUserToken(tokenId: number, tx?: any) {
    const updateUserTokenRecordArgs: UpdateUserTokenActivationRecordDTO = {
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
