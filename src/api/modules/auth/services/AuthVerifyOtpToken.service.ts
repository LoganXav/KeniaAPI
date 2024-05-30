import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { BaseService } from "../../base/services/Base.service"
import {
  UpdateUserAccountVerificationRecordDTO,
  UpdateUserTokenActivationRecordDTO,
  VerifyUserTokenDTO
} from "../types/AuthDTO"
import {
  ACCOUNT_VERIFIED,
  ERROR,
  ERROR_INVALID_TOKEN,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  TOKEN_EXPIRED
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import TokenProvider from "../providers/Token.provider"
import { autoInjectable } from "tsyringe"
import { TokenType, UserToken } from "@prisma/client"
import ProprietorInternalApiProvider from "~/api/shared/providers/proprietor/ProprietorInternalApi"
import DateTimeUtil from "~/utils/DateTimeUtil"
import DbClient from "~/infrastructure/internal/database"
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory"
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver"

@autoInjectable()
export default class AuthVerifyOtpTokenService extends BaseService<VerifyUserTokenDTO> {
  static serviceName = "AuthVerifyOtpTokenService"
  tokenProvider: TokenProvider
  proprietorInternalApiProvider: ProprietorInternalApiProvider
  loggingProvider: ILoggingDriver

  constructor(
    tokenProvider: TokenProvider,
    proprietorInternalApiProvider: ProprietorInternalApiProvider
  ) {
    super(AuthVerifyOtpTokenService.serviceName)
    this.tokenProvider = tokenProvider
    this.proprietorInternalApiProvider = proprietorInternalApiProvider
    this.loggingProvider = LoggingProviderFactory.build()
  }

  public async execute(trace: ServiceTrace, args: VerifyUserTokenDTO) {
    try {
      const { id: userId, otpToken } = args
      this.initializeServiceTrace(trace, args, ["otpToken"])

      if (!otpToken) {
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.BAD_REQUEST,
          ERROR_INVALID_TOKEN
        )
        return this.result
      }

      const dbOtpToken = await this.tokenProvider.findUserTokenByToken(otpToken)
      if (dbOtpToken === NULL_OBJECT) {
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.BAD_REQUEST,
          ERROR_INVALID_TOKEN
        )
        return this.result
      }

      if (dbOtpToken.tokenType != TokenType.EMAIL) {
        await this.deactivateUserToken(dbOtpToken.id)
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.BAD_REQUEST,
          ERROR_INVALID_TOKEN
        )
        return this.result
      }

      const tokenOwner =
        await this.proprietorInternalApiProvider.findProprietorById(userId)

      if (tokenOwner === NULL_OBJECT) {
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.BAD_REQUEST,
          ERROR_INVALID_TOKEN
        )
        return this.result
      }

      if (tokenOwner.hasVerified) {
        this.result.setData(
          SUCCESS,
          HttpStatusCodeEnum.CREATED,
          ACCOUNT_VERIFIED
        )
        trace.setSuccessful()
        return this.result
      }

      if (tokenOwner.id !== userId) {
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.BAD_REQUEST,
          ERROR_INVALID_TOKEN
        )
        return this.result
      }

      const data = await this.verifyUserAccountTransaction(dbOtpToken, userId)
      if (data === NULL_OBJECT) return this.result

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, ACCOUNT_VERIFIED)
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

  private async verifyUserAccountTransaction(
    dbOtpToken: UserToken,
    userId: number
  ) {
    try {
      const result = await DbClient.$transaction(async (tx) => {
        if (
          dbOtpToken.expired ||
          this.checkTokenExpired(dbOtpToken.expiresAt)
        ) {
          await this.deactivateUserToken(dbOtpToken.id, tx)

          this.result.setError(
            ERROR,
            HttpStatusCodeEnum.BAD_REQUEST,
            TOKEN_EXPIRED
          )
          return null
        }
        await this.verifyUserAccount(userId, tx)
        await this.deactivateUserToken(dbOtpToken.id, tx)
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

  private async verifyUserAccount(userId: number, tx?: any) {
    const verifyUserAccountArgs: UpdateUserAccountVerificationRecordDTO = {
      userId,
      hasVerified: true
    }
    await this.proprietorInternalApiProvider.updateUserAccountVerificationRecord(
      verifyUserAccountArgs,
      tx
    )
  }

  private checkTokenExpired(tokenExpiryDate: Date) {
    return DateTimeUtil.getCurrentDate() > tokenExpiryDate
  }
}
