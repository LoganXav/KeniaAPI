import { autoInjectable } from "tsyringe"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import { CreatePrincipalUserRecordDTO } from "../types/AuthDTO"
import AuthProvider from "../providers/auth/Auth.provider"
import TokenProvider from "../providers/auth/Token.provider"
import {
  ACCOUNT_CREATED,
  EMAIL_IN_USE,
  ERROR,
  NULL_OBJECT,
  SUCCESS
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { businessConfig } from "~/config/BusinessConfig"
import { DateTime } from "luxon"
import { generateStringOfLength } from "~/utils/GenerateStringOfLength"
import { User, UserTokenTypesEnum } from "@prisma/client"
import DbClient from "~/infrastructure/internal/database"
import Event from "~/api/shared/helpers/events"
import { eventTypes } from "~/api/shared/helpers/enums/EventTypes.enum"
import { JwtService } from "~/api/shared/services/jwt/Jwt.service"
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service"

@autoInjectable()
export default class AuthSignUpService extends BaseService<CreatePrincipalUserRecordDTO> {
  static serviceName = "AuthSignUpService"
  authProvider: AuthProvider
  tokenProvider: TokenProvider

  constructor(authProvider: AuthProvider, tokenProvider: TokenProvider) {
    super(AuthSignUpService.serviceName)

    this.authProvider = authProvider
    this.tokenProvider = tokenProvider
  }

  public async execute(
    trace: ServiceTrace,
    args: CreatePrincipalUserRecordDTO
  ): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args)
      const foundUser = await this.authProvider.findPrincipalUserByEmail(args)
      if (foundUser) {
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

      const data = await this.createPrincipalAndSchoolWithToken(input)
      if (data === NULL_OBJECT) return this.result

      const { principal, otpToken } = data

      Event.emit(eventTypes.user.signUp, {
        userEmail: principal.email,
        activationToken: otpToken
      })

      const accessToken = await JwtService.getJwt(principal)

      const { password, ...createdUserData } = principal

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
      this.result.setError(
        ERROR,
        HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        error.message
      )
      return this.result
    }
  }

  private async createPrincipalAndSchoolWithToken(
    args: CreatePrincipalUserRecordDTO
  ) {
    try {
      const result = await DbClient.$transaction(async (dbClient) => {
        const principal = await this.authProvider.createPrincipalUserRecord(
          args,
          dbClient
        )
        await this.authProvider.createSchoolRecord(principal.id, dbClient)

        const otpToken = generateStringOfLength(businessConfig.emailTokenLength)
        const expiresOn = DateTime.now()
          .plus({ minutes: businessConfig.emailTokenExpiresInMinutes })
          .toJSDate()

        await this.tokenProvider.createUserTokenRecord(
          {
            userId: principal.id,
            tokenType: UserTokenTypesEnum.EMAIL,
            expiresOn,
            token: otpToken
          },
          dbClient
        )

        return { principal, otpToken }
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
}
