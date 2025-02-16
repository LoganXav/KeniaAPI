import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { DELETE_ERROR, NOT_FOUND, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { StudentCriteriaType } from "../types/StudentTypes";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import StudentDeleteProvider from "../providers/StudentDelete.provider";
import StudentReadCache from "../cache/StudentRead.cache";
import UserReadCache from "../../user/cache/UserRead.cache";
import { RESOURCE_RECORD_DELETED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class DeleteStudentService extends BaseService<any> {
  static serviceName = "DeleteStudentService";
  studentDeleteProvider: StudentDeleteProvider;
  loggingProvider: ILoggingDriver;
  studentReadCache: StudentReadCache;
  userReadCache: UserReadCache;

  constructor(studentDeleteProvider: StudentDeleteProvider, studentReadCache: StudentReadCache, userReadCache: UserReadCache) {
    super(DeleteStudentService.serviceName);
    this.studentDeleteProvider = studentDeleteProvider;
    this.studentReadCache = studentReadCache;
    this.userReadCache = userReadCache;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: StudentCriteriaType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["deleteStudent"]);

      const student = await this.studentDeleteProvider.deleteOne(args);

      if (!student) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(NOT_FOUND), HttpStatusCodeEnum.NOT_FOUND);
      }

      await this.studentReadCache.invalidate(args.tenantId);
      await this.userReadCache.invalidate(args.tenantId);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY("Student"), student);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async deleteStudents(trace: ServiceTrace, args: StudentCriteriaType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["deleteStudents"]);

      const students = await this.studentDeleteProvider.deleteMany(args);

      if (!students.count) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(NOT_FOUND), HttpStatusCodeEnum.NOT_FOUND);
      }

      await this.studentReadCache.invalidate(args.tenantId);
      await this.userReadCache.invalidate(args.tenantId);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_DELETED_SUCCESSFULLY("Students"), students);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
