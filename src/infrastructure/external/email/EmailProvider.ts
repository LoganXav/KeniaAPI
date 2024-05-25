import { SendEmailArgs } from "~/api/shared/types/EmailActivationTypes"
import { IEmailDriver } from "./IEmailDriver"

export class EmailProvider {
  constructor(private emailDriver: IEmailDriver) {}

  public async sendEmail(sendEmailArgs: SendEmailArgs) {
    try {
      await this.emailDriver.sendEmail(sendEmailArgs)
    } catch (error) {
      console.log(error)
    }
  }
}
