import { autoInjectable } from "tsyringe"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import TokenProvider from "../providers/Token.provider"
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { RefreshUserTokenDTO, UpdateUserTokenRecordDTO } from "../types/AuthDTO"
import { TokenType } from "@prisma/client"
import {
  ACCOUNT_VERIFIED,
  EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS,
  ERROR,
  NULL_OBJECT,
  SUCCESS
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { generateStringOfLength } from "~/utils/GenerateStringOfLength"
import { businessConfig } from "~/config/BusinessConfig"
import { DateTime } from "luxon"
import DbClient from "~/infrastructure/internal/database"
import { EmailService } from "~/api/shared/services/email/Email.service"

@autoInjectable()
export default class AuthRefreshOtpTokenService extends BaseService<RefreshUserTokenDTO> {
  static serviceName = "AuthRefreshOtpTokenService"
  tokenProvider: TokenProvider

  constructor(tokenProvider: TokenProvider) {
    super(AuthRefreshOtpTokenService.serviceName)
    this.tokenProvider = tokenProvider
  }

  public async execute(
    trace: ServiceTrace,
    args: RefreshUserTokenDTO
  ): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args)

      if (args.hasVerified) {
        this.result.setData(
          SUCCESS,
          HttpStatusCodeEnum.CREATED,
          ACCOUNT_VERIFIED
        )
        return this.result
      }

      const otpToken = await this.authRefreshTokenTransaction(args)
      if (otpToken === NULL_OBJECT) return this.result

      await EmailService.sendAccountActivationEmail({
        userEmail: args.email,
        activationToken: otpToken
      })

      this.result.setData(
        SUCCESS,
        HttpStatusCodeEnum.CREATED,
        EMAIL_VERIFICATION_TOKEN_REQUEST_SUCCESS
      )

      trace.setSuccessful()
      return this.result
    } catch (error: any) {
      this.result.setError(
        ERROR,
        HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        error.message
      )
      return this.result
    }
  }

  private async authRefreshTokenTransaction(args: RefreshUserTokenDTO) {
    try {
      const result = await DbClient.$transaction(async (tx: any) => {
        const userTokens = await this.tokenProvider.findUserTokensByType(
          {
            userId: args.id,
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
            userId: args.id,
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
      this.result.setError(
        ERROR,
        HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        error.message
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
