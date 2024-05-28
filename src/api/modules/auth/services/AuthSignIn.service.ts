import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { BaseService } from "../../base/services/Base.service"
import { SignInUserRecordDTO } from "../types/AuthDTO"
import { IResult } from "~/api/shared/helpers/results/IResult"
import ProprietorInternalApiProvider from "~/api/shared/providers/proprietor/ProprietorInternalApi"
import {
  ERROR,
  INVALID_CREDENTIALS,
  NULL_OBJECT,
  SIGN_IN_SUCCESSFUL,
  SUCCESS
} from "~/api/shared/helpers/messages/SystemMessages"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service"
import { JwtService } from "~/api/shared/services/jwt/Jwt.service"
import { eventTypes } from "~/api/shared/helpers/enums/EventTypes.enum"
import Event from "~/api/shared/helpers/events"
import { autoInjectable } from "tsyringe"

@autoInjectable()
export default class AuthSignInService extends BaseService<SignInUserRecordDTO> {
  static serviceName: "AuthSignInService"
  proprietorInternalApiProvider: ProprietorInternalApiProvider
  constructor(proprietorInternalApiProvider: ProprietorInternalApiProvider) {
    super(AuthSignInService.serviceName)
    this.proprietorInternalApiProvider = proprietorInternalApiProvider
  }

  public async execute(
    trace: ServiceTrace,
    args: SignInUserRecordDTO
  ): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["password"])

      const foundUser =
        await this.proprietorInternalApiProvider.findProprietorByEmail(
          args.email
        )

      if (foundUser === NULL_OBJECT) {
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.BAD_REQUEST,
          INVALID_CREDENTIALS
        )
        return this.result
      }

      const isPasswordMatch = await PasswordEncryptionService.verifyPassword(
        args.password,
        foundUser.password
      )

      const IS_NOT_MATCH = false

      if (isPasswordMatch === IS_NOT_MATCH) {
        this.result.setError(
          ERROR,
          HttpStatusCodeEnum.BAD_REQUEST,
          INVALID_CREDENTIALS
        )
        return this.result
      }

      const accessToken = await JwtService.getJwt(foundUser)

      Event.emit(eventTypes.user.signIn, { userId: foundUser.id })

      if (foundUser.isFirstTimeLogin) {
        const updateUserRecordArgs = {
          userId: foundUser.id,
          isFirstTimeLogin: false
        }

        await this.proprietorInternalApiProvider.updateUserFirstTimeLoginRecord(
          updateUserRecordArgs
        )
      }

      const { password, ...SignedInUserData } = foundUser

      this.result.setData(
        SUCCESS,
        HttpStatusCodeEnum.SUCCESS,
        SIGN_IN_SUCCESSFUL,
        SignedInUserData,
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
}
