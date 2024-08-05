import { SendEmailArgs } from "~/api/shared/types/EmailActivationTypes";
import { IEmailDriver } from "./IEmailDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";

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
