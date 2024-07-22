import { autoInjectable } from "tsyringe";
import Event from "~/api/shared/helpers/events";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { JwtService } from "~/api/shared/services/jwt/Jwt.service";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { eventTypes } from "~/api/shared/helpers/enums/EventTypes.enum";
import { SignInUserType } from "~/api/shared/types/UserInternalApiTypes";
import UserReadProvider from "~/api/shared/providers/user/UserRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import StaffReadProvider from "~/api/modules/staff/providers/StaffRead.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { ERROR, INVALID_CREDENTIALS, NULL_OBJECT, SIGN_IN_SUCCESSFUL, STAFF, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import UserUpdateProvider from "~/api/shared/providers/user/UserUpdate.provider";

@autoInjectable()
export default class AuthSignInService extends BaseService<SignInUserType> {
  static serviceName: "AuthSignInService";
  staffReadProvider: StaffReadProvider;
  userReadProvider: UserReadProvider;
  userUpdateProvider: UserUpdateProvider;
  loggingProvider: ILoggingDriver;
  constructor(userReadProvider: UserReadProvider, staffReadProvider: StaffReadProvider, userUpdateProvider: UserUpdateProvider) {
    super(AuthSignInService.serviceName);
    this.userReadProvider = userReadProvider;
    this.userUpdateProvider = userUpdateProvider;
    this.staffReadProvider = staffReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: SignInUserType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["password"]);

      const foundUser = await this.userReadProvider.getOneByCriteria({ email: args.email });

      if (foundUser === NULL_OBJECT) {
        throw new BadRequestError(INVALID_CREDENTIALS);
      }

      const isPasswordMatch = await PasswordEncryptionService.verifyPassword(args.password, foundUser.password);

      const IS_NOT_MATCH = false;

      if (isPasswordMatch === IS_NOT_MATCH) {
        throw new BadRequestError(INVALID_CREDENTIALS);
      }

      Event.emit(eventTypes.user.signIn, { userId: foundUser.id });

      if (foundUser.isFirstTimeLogin) {
        const updateUserRecordArgs = {
          userId: foundUser.id,
          isFirstTimeLogin: false,
        };

        await this.userUpdateProvider.updateOneByCriteria(updateUserRecordArgs);
      }

      const { password, ...signedInUserData } = foundUser;

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, SIGN_IN_SUCCESSFUL, signedInUserData);

      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
