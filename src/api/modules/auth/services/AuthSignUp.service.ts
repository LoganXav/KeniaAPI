import { autoInjectable } from "tsyringe"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import TokenProvider from "../providers/Token.provider"
import {
  ACCOUNT_CREATED,
  EMAIL_IN_USE,
  ERROR,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { businessConfig } from "~/config/BusinessConfig"
import { DateTime } from "luxon"
import { generateStringOfLength } from "~/utils/GenerateStringOfLength"
import { TokenType } from "@prisma/client"
import DbClient from "~/infrastructure/internal/database"
import Event from "~/api/shared/helpers/events"
import { eventTypes } from "~/api/shared/helpers/enums/EventTypes.enum"
import { JwtService } from "~/api/shared/services/jwt/Jwt.service"
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service"
import ProprietorInternalApiProvider from "~/api/shared/providers/proprietor/ProprietorInternalApi"
import TenantInternalApiProvider from "~/api/shared/providers/tenant/TenantInternalApi"
import { SignUpUserRecordDTO } from "../types/AuthDTO"
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory"
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver"

@autoInjectable()
export default class AuthSignUpService extends BaseService<SignUpUserRecordDTO> {
  static serviceName = "AuthSignUpService"
  tokenProvider: TokenProvider
  proprietorInternalApiProvider: ProprietorInternalApiProvider
  tenantInternalApiProvider: TenantInternalApiProvider
  loggingProvider: ILoggingDriver

  constructor(
    tokenProvider: TokenProvider,
    proprietorInternalApiProvider: ProprietorInternalApiProvider,
    tenantInternalApiProvider: TenantInternalApiProvider
  ) {
    super(AuthSignUpService.serviceName)
    this.tokenProvider = tokenProvider
    this.proprietorInternalApiProvider = proprietorInternalApiProvider
    this.tenantInternalApiProvider = tenantInternalApiProvider
    this.loggingProvider = LoggingProviderFactory.build()
  }

  public async execute(
    trace: ServiceTrace,
    args: SignUpUserRecordDTO
  ): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["password"])
      const foundProprietor =
        await this.proprietorInternalApiProvider.findProprietorByEmail(
          args.email
        )
      if (foundProprietor) {
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.UNPROCESSABLE_ENTITY,
          EMAIL_IN_USE
        )
        return this.result
      }

      const hashedPassword = PasswordEncryptionService.hashPassword(
        args.password
      )

      const input = { ...args, password: hashedPassword }

      const data =
        await this.createTenantAndProprietorRecordWithTokenTransaction(input)
      if (data === NULL_OBJECT) return this.result

      const { proprietor, otpToken } = data

      Event.emit(eventTypes.user.signUp, {
        userEmail: proprietor.email,
        activationToken: otpToken
      })

      const accessToken = await JwtService.getJwt(proprietor)

      const { password, ...createdUserData } = proprietor

      this.result.setData(
        SUCCESS,
        HttpStatusCodeEnum.CREATED,
        ACCOUNT_CREATED,
        createdUserData,
        accessToken
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

  private async createTenantAndProprietorRecordWithTokenTransaction(
    args: SignUpUserRecordDTO
  ) {
    try {
      const result = await DbClient.$transaction(async (tx) => {
        const tenant = await this.tenantInternalApiProvider.createTenantRecord(
          tx
        )

        const input = { tenantId: tenant?.id, ...args }

        const proprietor =
          await this.proprietorInternalApiProvider.createProprietorRecord(
            input,
            tx
          )

        const otpToken = generateStringOfLength(businessConfig.emailTokenLength)
        const expiresAt = DateTime.now()
          .plus({ minutes: businessConfig.emailTokenExpiresInMinutes })
          .toJSDate()

        await this.tokenProvider.createUserTokenRecord(
          {
            userId: proprietor.id,
            tokenType: TokenType.EMAIL,
            expiresAt,
            token: otpToken
          },
          tx
        )

        return { proprietor, otpToken }
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
}
