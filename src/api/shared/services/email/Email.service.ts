import { TemplateService } from "~/api/shared/services/template/Template.service";
import { EmailProviderFactory } from "~/infrastructure/external/email/EmailProviderFactory";
import { SendAccountActivationEmailArgs, SendEmailArgs, SendPasswordResetLinkArgs } from "~/api/shared/types/EmailActivationTypes";
import { EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT, PASSWORD_RESET_TOKEN_EMAIL_SUBJECT } from "~/api/shared/helpers/messages/SystemMessages";

export class EmailService {
  public static async sendAccountActivationEmail(sendAccountActivationEmailArgs: SendAccountActivationEmailArgs) {
    const { userEmail, activationToken } = sendAccountActivationEmailArgs;
    const emailProvider = EmailProviderFactory.build();
    const emailTemplate = TemplateService.getEmailVerificationTemplate(activationToken);
    const activationEmailArgs: SendEmailArgs = {
      body: emailTemplate,
      subject: EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT,
      to: userEmail,
    };

    await emailProvider.sendEmail(activationEmailArgs);
  }

  public static async sendPasswordResetLink(sendPasswordRestLinkArgs: SendPasswordResetLinkArgs) {
    const { userEmail, passwordResetLink } = sendPasswordRestLinkArgs;
    const emailProvider = EmailProviderFactory.build();

    const emailTemplate = TemplateService.getPasswordResetEmailTemplate(passwordResetLink);

    const passwordResetEmailArgs: SendEmailArgs = {
      body: emailTemplate,
      subject: PASSWORD_RESET_TOKEN_EMAIL_SUBJECT,
      to: userEmail,
    };

    await emailProvider.sendEmail(passwordResetEmailArgs);
  }
}
