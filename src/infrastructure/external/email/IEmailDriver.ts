import { SendEmailArgs } from "~/api/shared/types/EmailActivationTypes";

export interface IEmailDriver {
  sendEmail(sendEmailArgs: SendEmailArgs): Promise<void>;
}
