import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import StudentTermResultReadProvider from "../providers/StudentTermResultRead.provider";
import { SUCCESS, STUDENT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class StudentTermResultReadService extends BaseService<IRequest> {
  static serviceName = "StudentTermResultReadService";
  loggingProvider: ILoggingDriver;
  studentTermResultReadProvider: StudentTermResultReadProvider;

  constructor(studentTermResultReadProvider: StudentTermResultReadProvider) {
    super(StudentTermResultReadService.serviceName);
    this.studentTermResultReadProvider = studentTermResultReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.query);

      const { tenantId } = args.body;
      const { termId, classId, classDivisionId } = args.query;

      const termResults = await this.studentTermResultReadProvider.getByCriteria({ tenantId: Number(tenantId), termId: Number(termId), classId: Number(classId), classDivisionId: Number(classDivisionId) });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STUDENT_RESOURCE), termResults);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
