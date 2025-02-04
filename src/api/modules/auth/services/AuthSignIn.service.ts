import { autoInjectable } from "tsyringe";
import Event from "~/api/shared/helpers/events";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { SignInUserType } from "~/api/modules/user/types/UserTypes";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { eventTypes } from "~/api/shared/helpers/enums/EventTypes.enum";
import UserReadProvider from "~/api/modules/user/providers/UserRead.provider";
import UserUpdateProvider from "~/api/modules/user/providers/UserUpdate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import StaffReadProvider from "~/api/modules/staff/providers/StaffRead.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { ERROR, INVALID_CREDENTIALS, NULL_OBJECT, SIGN_IN_SUCCESSFUL, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import { JwtService } from "~/api/shared/services/jwt/Jwt.service";
import UserReadCache from "../../user/cache/UserRead.cache";

@autoInjectable()
export default class AuthSignInService extends BaseService<SignInUserType> {
  static serviceName: "AuthSignInService";
  staffReadProvider: StaffReadProvider;
  userReadProvider: UserReadProvider;
  userUpdateProvider: UserUpdateProvider;
  userReadCache: UserReadCache;
  loggingProvider: ILoggingDriver;
  constructor(userReadProvider: UserReadProvider, staffReadProvider: StaffReadProvider, userUpdateProvider: UserUpdateProvider, userReadCache: UserReadCache) {
    super(AuthSignInService.serviceName);
    this.userReadProvider = userReadProvider;
    this.staffReadProvider = staffReadProvider;
    this.userUpdateProvider = userUpdateProvider;
    this.userReadCache = userReadCache;
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

      if (args.userType.toUpperCase() !== foundUser.userType) {
        throw new BadRequestError(INVALID_CREDENTIALS);
      }

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

        const newUser = await this.userUpdateProvider.updateOneByCriteria(updateUserRecordArgs);

        await this.userReadCache.update(newUser?.tenantId, newUser);
      }

      const accessToken = await JwtService.getJwt(foundUser);

      const { password, ...signedInUserData } = foundUser;

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, SIGN_IN_SUCCESSFUL, signedInUserData, accessToken);

      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setData(ERROR, error.httpStatusCode, error.description);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
