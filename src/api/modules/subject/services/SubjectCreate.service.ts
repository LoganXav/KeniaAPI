import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import SubjectReadProvider from "../providers/SubjectRead.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import SubjectCreateProvider from "../providers/SubjectCreate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { SUCCESS, SUBJECT_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_ALREADY_EXISTS, RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
@autoInjectable()
export default class SubjectCreateService extends BaseService<IRequest> {
  static serviceName = "SubjectCreateService";
  private subjectCreateProvider: SubjectCreateProvider;
  private subjectReadProvider: SubjectReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectCreateProvider: SubjectCreateProvider, subjectReadProvider: SubjectReadProvider) {
    super(SubjectCreateService.serviceName);
    this.subjectCreateProvider = subjectCreateProvider;
    this.subjectReadProvider = subjectReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const foundSubject = await this.subjectReadProvider.getOneByCriteria(args.body);

      if (foundSubject) {
        throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(SUBJECT_RESOURCE));
      }

      const subject = await this.subjectCreateProvider.create(args.body);
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(SUBJECT_RESOURCE), subject);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
