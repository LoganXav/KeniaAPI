import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, NULL_OBJECT, SUCCESS, USER_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { IRequest } from "~/infrastructure/internal/types";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import UserReadCache from "../cache/UserRead.cache";

@autoInjectable()
export default class UserReadService extends BaseService<IRequest> {
  static serviceName = "UserReadService";
  loggingProvider: ILoggingDriver;
  userReadCache: UserReadCache;
  constructor(userReadCache: UserReadCache) {
    super(UserReadService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.userReadCache = userReadCache;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { userId, tenantId } = args.body;

      const criteria = { userId: Number(userId), tenantId: Number(tenantId) };

      const foundUser = await this.userReadCache.getOneByCriteria({ ...criteria });

      if (foundUser === NULL_OBJECT) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(USER_RESOURCE));
      }

      const { password, ...data } = foundUser;

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(USER_RESOURCE), data);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
