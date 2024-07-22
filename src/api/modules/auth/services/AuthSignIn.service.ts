import { autoInjectable } from "tsyringe";
import Event from "~/api/shared/helpers/events";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { JwtService } from "~/api/shared/services/jwt/Jwt.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { eventTypes } from "~/api/shared/helpers/enums/EventTypes.enum";
import { SignInUserType } from "~/api/shared/types/UserInternalApiTypes";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import StaffReadProvider from "~/api/modules/staff/providers/StaffRead.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import UserInternalApiProvider from "~/api/shared/providers/user/UserInternalApi.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { ERROR, INVALID_CREDENTIALS, NULL_OBJECT, SIGN_IN_SUCCESSFUL, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class AuthSignInService extends BaseService<SignInUserType> {
  static serviceName: "AuthSignInService";
  userInternalApiProvider: UserInternalApiProvider;
  staffReadProvider: StaffReadProvider;
  loggingProvider: ILoggingDriver;
  constructor(userInternalApiProvider: UserInternalApiProvider, staffReadProvider: StaffReadProvider) {
    super(AuthSignInService.serviceName);
    this.userInternalApiProvider = userInternalApiProvider;
    this.staffReadProvider = staffReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: SignInUserType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["password"]);

      const foundUser = await this.userInternalApiProvider.findUserByEmail(args.email);

      if (foundUser === NULL_OBJECT) {
        throw new BadRequestError(INVALID_CREDENTIALS);
      }

      const isPasswordMatch = await PasswordEncryptionService.verifyPassword(args.password, foundUser.password);

      const IS_NOT_MATCH = false;

      if (isPasswordMatch === IS_NOT_MATCH) {
        throw new BadRequestError(INVALID_CREDENTIALS);
      }

      const accessToken = await JwtService.getJwt(foundUser);

      Event.emit(eventTypes.user.signIn, { userId: foundUser.id });

      if (foundUser.isFirstTimeLogin) {
        const updateUserRecordArgs = {
          userId: foundUser.id,
          isFirstTimeLogin: false,
        };

        await this.userInternalApiProvider.updateUserFirstTimeLoginRecord(updateUserRecordArgs);
      }

      let userTypeData: any;
      if (args.userType == "staff") {
        userTypeData = await this.staffReadProvider.getOneByCriteria({ userId: foundUser.id });
      }

      const { password, ...SignedInUserData } = foundUser;

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, SIGN_IN_SUCCESSFUL, { user: SignedInUserData, usertype: userTypeData }, accessToken);

      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
