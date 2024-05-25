import { render } from "mustache"
import emailConfirmationMail from "./templates/EmailConfirmationMail"

export class TemplateService {
  public static getEmailVerificationTemplate(token: string) {
    return render(emailConfirmationMail, {
      token
    })
  }
}
