import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { BaseService } from "../../base/services/Base.service"
import {
  UpdateUserAccountVerificationRecordDTO,
  UpdateUserTokenRecordDTO,
  VerifyUserTokenDTO
} from "../types/AuthDTO"
import {
  ACCOUNT_VERIFIED,
  ERROR,
  ERROR_INVALID_TOKEN,
  NULL_OBJECT,
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

@autoInjectable()
export default class AuthVerifyOtpTokenService extends BaseService<VerifyUserTokenDTO> {
  static serviceName = "AuthVerifyOtpTokenService"
  tokenProvider: TokenProvider
  proprietorInternalApiProvider: ProprietorInternalApiProvider

  constructor(
    tokenProvider: TokenProvider,
    proprietorInternalApiProvider: ProprietorInternalApiProvider
  ) {
    super(AuthVerifyOtpTokenService.serviceName)
    this.tokenProvider = tokenProvider
    this.proprietorInternalApiProvider = proprietorInternalApiProvider
  }

  public async execute(trace: ServiceTrace, args: VerifyUserTokenDTO) {
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
      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, ACCOUNT_VERIFIED)
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

    await this.verifyUserAccountTransaction(dbOtpToken, userId)

    this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, ACCOUNT_VERIFIED)
    trace.setSuccessful()
    return this.result
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
          return this.result
        }
        await this.verifyUserAccount(userId, tx)
        await this.deactivateUserToken(dbOtpToken.id, tx)
      })

      return result
    } catch (error: any) {
      this.result.setError(
        ERROR,
        HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        error.message
      )
      return null
    }
  }

  private async deactivateUserToken(tokenId: number, tx?: any) {
    const updateUserTokenRecordArgs: UpdateUserTokenRecordDTO = {
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
