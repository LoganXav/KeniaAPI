import { EmailService } from "~/api/shared/services/email/Email.service";
import { SignUpEventListenerDTO, SignInEventListenerDTO } from "../types/EventsDTO";
import DateTimeUtil from "~/utils/DateTimeUtil";
import UserUpdateProvider from "~/api/shared/providers/user/UserUpdate.provider";

const userUpdateProvider = new UserUpdateProvider();
export class UserListener {
  constructor() {}
  public static async onUserSignUp(onSignUpEventListenerArgs: SignUpEventListenerDTO) {
    await EmailService.sendAccountActivationEmail(onSignUpEventListenerArgs);
  }
  public static async onUserSignIn(onSignInEventListenerArgs: SignInEventListenerDTO) {
    const lastLoginDate = DateTimeUtil.getCurrentDate();
    await userUpdateProvider.updateOneByCriteria({
      userId: onSignInEventListenerArgs.userId,
      lastLoginDate,
    });
  }
}
