import { autoInjectable } from "tsyringe"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import { CreatePrincipalUserRecordDTO, User } from "../types/AuthDTO"
import AuthProvider from "../providers/auth/Auth.provider"
import TokenProvider from "../providers/auth/Token.provider"
import {
  ACCOUNT_CREATED,
  EMAIL_IN_USE,
  ERROR,
  SUCCESS
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { IResponse } from "~/infrastructure/internal/types"
import { businessConfig } from "~/config/BusinessConfig"
import { DateTime } from "luxon"
import { generateStringOfLength } from "~/utils/GenerateStringOfLength"
import { UserTokenTypesEnum } from "@prisma/client"
import DbClient from "~/infrastructure/internal/database"

@autoInjectable()
export default class AuthSignUpService extends BaseService<CreatePrincipalUserRecordDTO> {
  authProvider: AuthProvider
  tokenProvider: TokenProvider

  constructor(authProvider: AuthProvider, tokenProvider: TokenProvider) {
    super()
    this.authProvider = authProvider
    this.tokenProvider = tokenProvider
  }

  public async execute(
    args: CreatePrincipalUserRecordDTO,
    res: IResponse
  ): Promise<IResult> {
    try {
      const foundUser = await this.authProvider.findPrincipalUserByEmail(args)
      if (foundUser) {
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.UNPROCESSABLE_ENTITY,
          EMAIL_IN_USE
        )
        return this.result
      }

      const data = await this.createPrincipalAndSchoolWithToken(args)

      /**
       * TODO
       * 1 - Emit an event to trigger OTP mail transfer.
       * 2 - Generate JWT Access tokens and return with result object.
       */

      this.result.setData(
        SUCCESS,
        HttpStatusCodeEnum.CREATED,
        ACCOUNT_CREATED,
        data
      )

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
    return DbClient.$transaction(async (prisma) => {
      const principal = await this.authProvider.createPrincipalUserRecord(args)
      await this.authProvider.createSchoolRecord(principal.id)

      const token = generateStringOfLength(businessConfig.emailTokenLength)
      const expiresOn = DateTime.now()
        .plus({ minutes: businessConfig.emailTokenExpiresInMinutes })
        .toJSDate()

      await this.tokenProvider.createUserTokenRecord({
        userId: principal.id,
        tokenType: UserTokenTypesEnum.EMAIL,
        expiresOn,
        token
      })

      return principal
    }).catch((error) => {
      this.result.setError(
        ERROR,
        HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        error.message
      )
      return this.result
    })
  }
}
