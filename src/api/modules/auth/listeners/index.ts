import { EmailService } from "~/api/shared/services/email/Email.service"
import {
  SignUpEventListenerDTO,
  SignInEventListenerDTO
} from "../types/EventsDTO"
import ProprietorInternalApiProvider from "~/api/shared/providers/proprietor/ProprietorInternalApi"
import DateTimeUtil from "~/utils/DateTimeUtil"

const proprietorInternalApiProvider = new ProprietorInternalApiProvider()
export class UserListener {
  constructor() {}
  public static async onUserSignUp(
    onSignUpEventListenerArgs: SignUpEventListenerDTO
  ) {
    await EmailService.sendAccountActivationEmail(onSignUpEventListenerArgs)
  }
  public static async onUserSignIn(
    onSignInEventListenerArgs: SignInEventListenerDTO
  ) {
    const lastLoginDate = DateTimeUtil.getCurrentDate()
    await proprietorInternalApiProvider.updateUserLastLoginDate({
      userId: onSignInEventListenerArgs.userId,
      lastLoginDate
    })
  }
}
