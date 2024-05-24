import { EmailService } from "~/api/shared/services/Email.service"
import { SignUpEventListenerDTO } from "../types/SignUpEventListenerDTO"

export class UserListener {
  public static async onUserSignUp(
    onSignUpEventListenerArgs: SignUpEventListenerDTO
  ) {
    await EmailService.sendAccountActivationEmail(onSignUpEventListenerArgs)
  }
}
