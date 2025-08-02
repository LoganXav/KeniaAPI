import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import StudentTermResultUpdateProvider from "../providers/StudentTermResultUpdate.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, SUCCESS, STUDENT_TERM_RESULT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class StudentTermResultUpdateService extends BaseService<IRequest> {
  static serviceName = "StudentTermResultUpdateService";
  loggingProvider: ILoggingDriver;
  studentTermResultUpdateProvider: StudentTermResultUpdateProvider;

  constructor(studentTermResultUpdateProvider: StudentTermResultUpdateProvider) {
    super(StudentTermResultUpdateService.serviceName);
    this.studentTermResultUpdateProvider = studentTermResultUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const updatedStudentTermResult = await this.studentTermResultUpdateProvider.update(args.body);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(STUDENT_TERM_RESULT_RESOURCE), updatedStudentTermResult);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }
}
