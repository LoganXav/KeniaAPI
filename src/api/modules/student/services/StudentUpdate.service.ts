import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { NOT_FOUND, SOMETHING_WENT_WRONG, SUCCESS, UPDATED } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import StudentUpdateProvider from "../providers/StudentUpdate.provider";
import { StudentUpdateManyRequestType, StudentUpdateRequestType } from "../types/StudentTypes";
import { RESOURCE_RECORD_NOT_FOUND, RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import UserReadCache from "../../user/cache/UserRead.cache";
import StudentReadCache from "../cache/StudentRead.cache";
import UserUpdateProvider from "../../user/providers/UserUpdate.provider";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@autoInjectable()
export default class StudentUpdateService extends BaseService<any> {
  static serviceName = "StudentUpdateService";
  studentUpdateProvider: StudentUpdateProvider;
  userUpdateProvider: UserUpdateProvider;
  loggingProvider: ILoggingDriver;
  userReadCache: UserReadCache;
  studentReadCache: StudentReadCache;

  constructor(studentUpdateProvider: StudentUpdateProvider, userUpdateProvider: UserUpdateProvider, userReadCache: UserReadCache, studentReadCache: StudentReadCache) {
    super(StudentUpdateService.serviceName);
    this.studentUpdateProvider = studentUpdateProvider;
    this.userUpdateProvider = userUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
    this.userReadCache = userReadCache;
    this.studentReadCache = studentReadCache;
  }

  public async execute(trace: ServiceTrace, args: StudentUpdateRequestType & { id: string; tenantId: number }): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const foundStudent = await this.userReadCache.getOneByCriteria({
        tenantId: Number(args.tenantId),
        id: Number(args.id),
      });

      if (!foundStudent) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(NOT_FOUND), HttpStatusCodeEnum.NOT_FOUND);
      }

      const result = await this.updateStudentTransaction(args);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(UPDATED), result);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async updateMany(trace: ServiceTrace, args: StudentUpdateManyRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const foundStudents = await this.studentReadCache.getByCriteria({
        ids: args.ids,
        tenantId: args.tenantId,
      });

      if (!foundStudents?.length) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(NOT_FOUND), HttpStatusCodeEnum.NOT_FOUND);
      }

      const students = await this.studentUpdateProvider.updateMany(args);
      await this.studentReadCache.invalidate(args.tenantId);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(UPDATED), students);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async updateStudentTransaction(args: StudentUpdateRequestType & { id: string; tenantId: number }) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        // Update user-related fields
        const userUpdateData = {
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          phoneNumber: args.phoneNumber,
          gender: args.gender,
          dateOfBirth: args.dateOfBirth,
          residentialAddress: args.residentialAddress,
          residentialStateId: args.residentialStateId,
          residentialLgaId: args.residentialLgaId,
          residentialCountryId: args.residentialCountryId,
          residentialZipCode: args.residentialZipCode,
        };

        await this.userUpdateProvider.updateOneByCriteria(
          {
            ...userUpdateData,
            userId: Number(args.id),
          },
          tx
        );

        // Update student-specific fields
        const student = await this.studentUpdateProvider.updateOne(
          {
            ...args,
            id: Number(args.id),
          },
          tx
        );

        await this.userReadCache.invalidate(args.tenantId);
        await this.studentReadCache.invalidate(args.tenantId);

        return student;
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
