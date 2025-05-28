import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import ClassReadProvider from "~/api/modules/class/providers/ClassRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import GradeOptionsConstants from "~/api/shared/helpers/constants/GradeOptions.constants";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, TENANT_GRADING_STRUCTURE_RESOURCE, ERROR } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class TenantGradingStructureTemplateService extends BaseService<IRequest> {
  static serviceName = "TenantGradingStructureTemplateService";
  private classReadProvider: ClassReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(classReadProvider: ClassReadProvider) {
    super(TenantGradingStructureTemplateService.serviceName);
    this.classReadProvider = classReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId } = args.body;

      const { classIds } = args.query;

      // Fetch classes that have no grading structures assigned for this tenant
      const classes = await this.classReadProvider.getByCriteria({
        tenantId,
        withoutGradingStructures: true,
      });

      const classIdsArray = classIds.split(",").map((id: number) => Number(id));

      const existingClasses = await this.classReadProvider.getByCriteria({
        tenantId,
        ids: classIdsArray,
      });

      console.log(existingClasses, "existingClassesexistingClasses");

      const template = {
        classOptions: classes.concat(existingClasses),
        gradeOptions: GradeOptionsConstants,
      };

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TENANT_GRADING_STRUCTURE_RESOURCE), template);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
