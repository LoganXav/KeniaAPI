import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import { autoInjectable } from "tsyringe"
import {
  ERROR,
  NULL_OBJECT,
  PASSWORD_RESET_LINK_GENERATED,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  USER_RESOURCE
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import UserInternalApiProvider from "~/api/shared/providers/user/UserInternalApi.provider"
import { RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction"
import DbClient from "~/infrastructure/internal/database"
import TokenProvider from "../providers/Token.provider"
import { TokenType, User } from "@prisma/client"
import { generateStringOfLength } from "~/utils/GenerateStringOfLength"
import { businessConfig } from "~/config/BusinessConfig"
import { DateTime } from "luxon"
import { EmailService } from "~/api/shared/services/email/Email.service"
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver"
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory"
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError"
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError"

@autoInjectable()
export default class AuthPasswordResetRequestService extends BaseService<unknown> {
  static serviceName = "AuthPasswordResetRequestService"
  userInternalApiProvider: UserInternalApiProvider
  tokenProvider: TokenProvider
  loggingProvider: ILoggingDriver
  constructor(
    userInternalApiProvider: UserInternalApiProvider,
    tokenProvider: TokenProvider
  ) {
    super(AuthPasswordResetRequestService.serviceName)
    this.userInternalApiProvider = userInternalApiProvider
    this.tokenProvider = tokenProvider
    this.loggingProvider = LoggingProviderFactory.build()
  }
  public async execute(trace: ServiceTrace, args: any): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args)
      const { email } = args

      const foundUser = await this.userInternalApiProvider.findUserByEmail(
        email
      )

      if (foundUser === NULL_OBJECT) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(USER_RESOURCE))
      }

      const data = await this.passwordResetTokenTransaction(
        foundUser.id,
        foundUser.email
      )

      await EmailService.sendPasswordResetLink(data)

      this.result.setData(
        SUCCESS,
        HttpStatusCodeEnum.SUCCESS,
        PASSWORD_RESET_LINK_GENERATED
      )

      trace.setSuccessful()
      return this.result
    } catch (error: any) {
      this.loggingProvider.error(error)
      this.result.setError(ERROR, error.httpStatusCode, error.description)
      return this.result
    }
  }

  private async passwordResetTokenTransaction(userId: number, email: string) {
    try {
      const result = await DbClient.$transaction(async (tx) => {
        const passwordResetToken =
          await this.tokenProvider.findActiveUserTokenByType(
            {
              userId,
              tokenType: TokenType.PASSWORD_RESET,
              expired: false,
              isActive: true
            },
            tx
          )

        if (passwordResetToken) {
          this.tokenProvider.updateUserTokenRecord(
            {
              tokenId: passwordResetToken.id,
              expired: true,
              isActive: false
            },
            tx
          )
        }

        const token = generateStringOfLength(
          businessConfig.passwordResetTokenLength
        )

        const expiresAt = DateTime.now()
          .plus({ minutes: businessConfig.emailTokenExpiresInMinutes })
          .toJSDate()

        const newPasswordResetToken =
          await this.tokenProvider.createUserTokenRecord(
            {
              userId,
              tokenType: TokenType.PASSWORD_RESET,
              expiresAt,
              token: token
            },
            tx
          )

        const passwordResetLink = `${businessConfig.passwordResetTokenLink}/${newPasswordResetToken.token}`

        const sendPasswordResetLinkArgs = {
          userEmail: email,
          passwordResetLink: passwordResetLink
        }
        return sendPasswordResetLinkArgs
      })
      return result
    } catch (error: any) {
      this.loggingProvider.error(error)
      throw new InternalServerError(SOMETHING_WENT_WRONG)
    }
  }
}
