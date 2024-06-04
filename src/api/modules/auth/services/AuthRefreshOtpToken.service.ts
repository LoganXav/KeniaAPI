import { autoInjectable } from "tsyringe"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import TokenProvider from "../providers/Token.provider"
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"

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
import UserInternalApiProvider from "~/api/shared/providers/user/UserInternalApi.provider"
import {
  RefreshUserTokenType,
  UpdateUserTokenActivationRecordType
} from "~/api/shared/types/UserInternalApiTypes"
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError"
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError"

@autoInjectable()
export default class AuthRefreshOtpTokenService extends BaseService<RefreshUserTokenType> {
  static serviceName = "AuthRefreshOtpTokenService"
  tokenProvider: TokenProvider
  userInternalApiProvider: UserInternalApiProvider
  loggingProvider: ILoggingDriver

  constructor(
    tokenProvider: TokenProvider,
    userInternalApiProvider: UserInternalApiProvider
  ) {
    super(AuthRefreshOtpTokenService.serviceName)
    this.tokenProvider = tokenProvider
    this.userInternalApiProvider = userInternalApiProvider
    this.loggingProvider = LoggingProviderFactory.build()
  }

  public async execute(
    trace: ServiceTrace,
    args: RefreshUserTokenType
  ): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args)

      const foundUser = await this.userInternalApiProvider.findUserByEmail(
        args.email
      )

      if (foundUser === NULL_OBJECT) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(USER_RESOURCE))
      }

      if (foundUser.hasVerified) {
        this.result.setData(
          SUCCESS,
          HttpStatusCodeEnum.ACCEPTED,
          ACCOUNT_VERIFIED
        )
        trace.setSuccessful()
        return this.result
      }

      const otpToken = await this.authRefreshTokenTransaction(foundUser)

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
      this.result.setError(ERROR, error.httpStatusCode, error.description)
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
      throw new InternalServerError(SOMETHING_WENT_WRONG)
    }
  }

  private async deactivateUserToken(tokenId: number, tx: any) {
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
}
