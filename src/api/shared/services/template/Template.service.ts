import { render } from "mustache";
import emailConfirmationMail from "./templates/EmailConfirmationMail";
import passwordResetEmail from "./templates/PasswordResetMail";

export class TemplateService {
  public static getEmailVerificationTemplate(token: string) {
    return render(emailConfirmationMail, {
      token,
    });
  }

  public static getPasswordResetEmailTemplate(resetLink: string) {
    return render(passwordResetEmail, {
      resetLink,
    });
  }
}
