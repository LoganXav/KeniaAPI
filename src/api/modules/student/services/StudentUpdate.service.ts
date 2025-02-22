import { autoInjectable } from "tsyringe";
import StudentReadCache from "../cache/StudentRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
import UserReadCache from "../../user/cache/UserRead.cache";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StudentUpdateProvider from "../providers/StudentUpdate.provider";
import GuardianReadCache from "../../guardian/cache/GuardianRead.cache";
import UserUpdateProvider from "../../user/providers/UserUpdate.provider";
import { GuardianUpdateRequestType } from "../../guardian/types/GuardianTypes";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import GuardianUpdateProvider from "../../guardian/providers/GuardianUpdate.provider";
import GuardianCreateProvider from "../../guardian/providers/GuardianCreate.provider";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { StudentUpdateManyRequestType, StudentUpdateRequestType } from "../types/StudentTypes";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { SOMETHING_WENT_WRONG, STUDENT_RESOURCE, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_NOT_FOUND, RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class StudentUpdateService extends BaseService<IRequest> {
  static serviceName = "StudentUpdateService";
  userReadCache: UserReadCache;
  loggingProvider: ILoggingDriver;
  studentReadCache: StudentReadCache;
  guardianReadCache: GuardianReadCache;
  userUpdateProvider: UserUpdateProvider;
  studentUpdateProvider: StudentUpdateProvider;
  guardianUpdateProvider: GuardianUpdateProvider;
  guardianCreateProvider: GuardianCreateProvider;

  constructor(
    userReadCache: UserReadCache,
    studentReadCache: StudentReadCache,
    guardianReadCache: GuardianReadCache,
    userUpdateProvider: UserUpdateProvider,
    studentUpdateProvider: StudentUpdateProvider,
    guardianUpdateProvider: GuardianUpdateProvider,
    guardianCreateProvider: GuardianCreateProvider
  ) {
    super(StudentUpdateService.serviceName);
    this.userReadCache = userReadCache;
    this.studentReadCache = studentReadCache;
    this.guardianReadCache = guardianReadCache;
    this.userUpdateProvider = userUpdateProvider;
    this.studentUpdateProvider = studentUpdateProvider;
    this.guardianUpdateProvider = guardianUpdateProvider;
    this.guardianCreateProvider = guardianCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const foundUser = await this.userReadCache.getOneByCriteria({
        tenantId: Number(args.body.tenantId),
        email: args.body.email,
      });

      if (!foundUser) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STUDENT_RESOURCE), HttpStatusCodeEnum.BAD_REQUEST);
      }

      const result = await this.updateStudentTransaction({ ...args.body, id: Number(args.params.id), userId: foundUser.id });

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(STUDENT_RESOURCE), result);

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
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STUDENT_RESOURCE), HttpStatusCodeEnum.NOT_FOUND);
      }

      const students = await this.studentUpdateProvider.updateMany(args);
      await this.studentReadCache.invalidate(args.tenantId);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(STUDENT_RESOURCE), students);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async updateStudentTransaction(args: StudentUpdateRequestType & { id: string; userId: number }) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        // Update user-related fields
        await this.userUpdateProvider.updateOneByCriteria(
          {
            ...args,
            userId: Number(args.userId),
          },
          tx
        );

        // Update or create guardians and collect their IDs
        const guardianIds: number[] = [];
        if (args.guardians?.length) {
          const guardianData = args.guardians.map((guardian) => ({
            ...guardian,
            tenantId: args.tenantId,
          }));

          for (const guardian of guardianData) {
            const foundGuardian = await this.guardianReadCache.getByCriteria({
              email: guardian.email,
              tenantId: args.tenantId,
            });
            if (foundGuardian?.[0]) {
              guardianIds.push(foundGuardian[0].id);
              continue;
            }

            if (!guardian.id) {
              const newGuardian = await this.guardianCreateProvider.create(guardian, tx);
              guardianIds.push(newGuardian.id);
            } else {
              const updatedGuardian = await this.guardianUpdateProvider.update(guardian as GuardianUpdateRequestType, tx);
              guardianIds.push(updatedGuardian.id);
            }
          }
        }

        // Update student-specific fields with guardian IDs
        const student = await this.studentUpdateProvider.updateOne(
          {
            ...args,
            id: Number(args.id),
            guardianIds,
          },
          tx
        );

        await this.userReadCache.invalidate(args.tenantId);
        await this.studentReadCache.invalidate(args.tenantId);
        await this.guardianReadCache.invalidate(args.tenantId);

        return student;
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
