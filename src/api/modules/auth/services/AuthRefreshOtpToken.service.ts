import { autoInjectable } from "tsyringe"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import TokenProvider from "../providers/Token.provider"
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { RefreshUserTokenDTO, UpdateUserTokenRecordDTO } from "../types/AuthDTO"
import { TokenType, User } from "@prisma/client"
import {
  ACCOUNT_VERIFIED,
  TOKEN_REFRESH_SUCCESS,
  ERROR,
  NULL_OBJECT,
  SUCCESS,
  SOMETHING_WENT_WRONG,
  USER_RESOURCE
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { generateStringOfLength } from "~/utils/GenerateStringOfLength"
import { businessConfig } from "~/config/BusinessConfig"
import { DateTime } from "luxon"
import DbClient from "~/infrastructure/internal/database"
import { EmailService } from "~/api/shared/services/email/Email.service"
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory"
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver"
import { RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction"
import ProprietorInternalApiProvider from "~/api/shared/providers/proprietor/ProprietorInternalApi"

@autoInjectable()
export default class AuthRefreshOtpTokenService extends BaseService<RefreshUserTokenDTO> {
  static serviceName = "AuthRefreshOtpTokenService"
  tokenProvider: TokenProvider
  proprietorInternalApiProvider: ProprietorInternalApiProvider
  loggingProvider: ILoggingDriver

  constructor(
    tokenProvider: TokenProvider,
    proprietorInternalApiProvider: ProprietorInternalApiProvider
  ) {
    super(AuthRefreshOtpTokenService.serviceName)
    this.tokenProvider = tokenProvider
    this.proprietorInternalApiProvider = proprietorInternalApiProvider
    this.loggingProvider = LoggingProviderFactory.build()
  }

  public async execute(
    trace: ServiceTrace,
    args: RefreshUserTokenDTO
  ): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args)

      const foundUser =
        await this.proprietorInternalApiProvider.findProprietorByEmail(
          args.email
        )

      if (foundUser === NULL_OBJECT) {
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.BAD_REQUEST,
          RESOURCE_RECORD_NOT_FOUND(USER_RESOURCE)
        )
        return this.result
      }

      if (foundUser.hasVerified) {
        this.result.setData(
          SUCCESS,
          HttpStatusCodeEnum.CREATED,
          ACCOUNT_VERIFIED
        )
        return this.result
      }

      const otpToken = await this.authRefreshTokenTransaction(foundUser)
      if (otpToken === NULL_OBJECT) return this.result

      await EmailService.sendAccountActivationEmail({
        userEmail: foundUser.email,
        activationToken: otpToken
      })

      this.result.setData(
        SUCCESS,
        HttpStatusCodeEnum.CREATED,
        TOKEN_REFRESH_SUCCESS
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

  private async authRefreshTokenTransaction(foundUser: User) {
    try {
      const result = await DbClient.$transaction(async (tx: any) => {
        const userTokens = await this.tokenProvider.findUserTokensByType(
          {
            userId: foundUser.id,
            tokenType: TokenType.EMAIL
          },
          tx
        )

        if (userTokens) {
          for (const token of userTokens) {
            await this.deactivateUserToken(token.id, tx)
          }
        }

        const otpToken = generateStringOfLength(businessConfig.emailTokenLength)

        const expiresAt = DateTime.now()
          .plus({ minutes: businessConfig.emailTokenExpiresInMinutes })
          .toJSDate()

        await this.tokenProvider.createUserTokenRecord(
          {
            userId: foundUser.id,
            tokenType: TokenType.EMAIL,
            expiresAt,
            token: otpToken
          },
          tx
        )

        return otpToken
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

  private async deactivateUserToken(tokenId: number, tx: any) {
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
}
