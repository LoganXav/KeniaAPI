import DateTimeUtil from "~/utils/DateTimeUtil";
import { EmailService } from "~/api/shared/services/email/Email.service";
import UserUpdateProvider from "~/api/modules/user/providers/UserUpdate.provider";
import { SignUpEventListenerDTO, SignInEventListenerDTO } from "~/api/modules/auth/types/EventsDTO";

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
