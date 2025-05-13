import { SendEmailArgs } from "~/api/shared/types/EmailActivationTypes";
import { IEmailDriver } from "~/infrastructure/external/email/IEmailDriver";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

export class EmailProvider {
  loggingProvider: ILoggingDriver;
  constructor(private emailDriver: IEmailDriver) {
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async sendEmail(sendEmailArgs: SendEmailArgs) {
    try {
      await this.emailDriver.sendEmail(sendEmailArgs);
    } catch (error: any) {
      this.loggingProvider.error(error);
    }
  }
}
