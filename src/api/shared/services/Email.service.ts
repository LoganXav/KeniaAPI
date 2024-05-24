import { EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT } from "../helpers/messages/SystemMessages"
import {
  SendAccountActivationEmailArgs,
  SendEmailArgs
} from "../types/EmailActivationTypes"

export class EmailService {
  public static async sendAccountActivationEmail(
    sendAccountActivationEmailArgs: SendAccountActivationEmailArgs
  ) {
    // TODO - Integrate rabbitMQ to guarantee otp mail delivery
    // const { userEmail, activationToken } = sendAccountActivationEmailArgs
    // const emailProvider = EmailProviderFactory.build()
    // const emailTemplate =
    //   TemplateService.getEmailVerificationTemplate(activationToken)
    // const activationEmailArgs: SendEmailArgs = {
    //   body: emailTemplate,
    //   subject: EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT,
    //   to: userEmail
    // }
    // await emailProvider.sendEmail(activationEmailArgs)
  }
}
