import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ERROR, SUCCESS, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class SchoolCalendarTemplateService extends BaseService<IRequest> {
  static serviceName = "SchoolCalendarTemplateService";
  loggingProvider: ILoggingDriver;

  constructor() {
    super(SchoolCalendarTemplateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);

      const data = {
        schoolSessionOptions: this.generateSchoolSessions(2020, 30),
      };

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TEMPLATE_RESOURCE), data);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private generateSchoolSessions(startYear: number, count: number): { id: number; year: number; name: string }[] {
    return Array.from({ length: count }, (_, i) => {
      const year = startYear + i;
      return {
        id: i + 1,
        name: `${year}/${year + 1} Session`,
        year,
      };
    });
  }
}
