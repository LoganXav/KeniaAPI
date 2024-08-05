import nodemailer from "nodemailer";
import { SendEmailArgs } from "~/api/shared/types/EmailActivationTypes";
import { IEmailDriver } from "./IEmailDriver";
import { emailConfig } from "~/config/EmailConfig";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

export class NodeMailerDriver implements IEmailDriver {
  transporter;
  loggingProvider;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.mailtrap.host,
      port: emailConfig.mailtrap.port,
      secure: emailConfig.emailSecure,
      auth: {
        user: "api",
        pass: this.getPassKey(),
      },
    });
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async sendEmail(sendEmailArgs: SendEmailArgs) {
    const { subject, body, to } = sendEmailArgs;
    try {
      const result = await this.transporter.sendMail({
        from: emailConfig.mailtrap.emailFromEmail,
        to,
        subject,
        html: `<h3>${body}</h3>`,
      });

      this.loggingProvider.info(`Email Sent: ${result.messageId}`);
    } catch (error) {
      this.loggingProvider.error(`Error: ${error}`);
    }
  }

  private getPassKey() {
    return emailConfig.mailtrap.key;
  }
}
