import { EmailService } from "~/api/shared/services/email/Email.service"
import {
  SignUpEventListenerDTO,
  SignInEventListenerDTO
} from "../types/EventsDTO"

export class UserListener {
  public static async onUserSignUp(
    onSignUpEventListenerArgs: SignUpEventListenerDTO
  ) {
    await EmailService.sendAccountActivationEmail(onSignUpEventListenerArgs)
  }
  public static async onUserSignIn(
    onSignInEventListenerArgs: SignInEventListenerDTO
  ) {
    // TODO - update last login date
    await null
  }
}
