import { EmailService } from "~/api/shared/services/email/Email.service"
import { SignUpEventListenerDTO } from "../types/EventsDTO"

export class UserListener {
  public static async onUserSignUp(
    onSignUpEventListenerArgs: SignUpEventListenerDTO
  ) {
    await EmailService.sendAccountActivationEmail(onSignUpEventListenerArgs)
  }
}
