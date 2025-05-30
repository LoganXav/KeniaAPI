import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import SubjectReadProvider from "../providers/SubjectRead.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { SUCCESS, SUBJECT_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class SubjectReadService extends BaseService<IRequest> {
  static serviceName = "SubjectReadService";
  loggingProvider: ILoggingDriver;
  private subjectReadProvider: SubjectReadProvider;

  constructor(subjectReadProvider: SubjectReadProvider) {
    super(SubjectReadService.serviceName);
    this.subjectReadProvider = subjectReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { staffIds } = args.query;

      const parsedStaffIds =
        staffIds &&
        staffIds
          .split(",")
          .map((id: string) => Number(id.trim()))
          .filter(Boolean);

      const subjects = await this.subjectReadProvider.getByCriteria({ staffIds: parsedStaffIds, ...args.body });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(SUBJECT_RESOURCE), subjects);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async readOne(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);
      const subject = await this.subjectReadProvider.getOneByCriteria({ ...args.body, id: Number(args.params.id) });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(SUBJECT_RESOURCE), subject);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
