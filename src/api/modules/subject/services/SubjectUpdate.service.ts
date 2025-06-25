import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import SubjectReadProvider from "../providers/SubjectRead.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import SubjectUpdateProvider from "../providers/SubjectUpdate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { SUCCESS, SUBJECT_RESOURCE, ERROR, CLASS_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_CANNOT_BE_UPDATED, RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class SubjectUpdateService extends BaseService<IRequest> {
  static serviceName = "SubjectUpdateService";
  private subjectReadProvider: SubjectReadProvider;
  private subjectUpdateProvider: SubjectUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectReadProvider: SubjectReadProvider, subjectUpdateProvider: SubjectUpdateProvider) {
    super(SubjectUpdateService.serviceName);
    this.subjectReadProvider = subjectReadProvider;
    this.subjectUpdateProvider = subjectUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { classId, tenantId } = args.body;

      const foundSubject = await this.subjectReadProvider.getOneByCriteria({ tenantId, id: Number(args.params.id) });

      if (foundSubject?.classId !== classId) {
        throw new BadRequestError(RESOURCE_RECORD_CANNOT_BE_UPDATED(CLASS_RESOURCE));
      }

      const subject = await this.subjectUpdateProvider.update({ ...args.body, id: Number(args.params.id) });
      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(SUBJECT_RESOURCE), subject);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
