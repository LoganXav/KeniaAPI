import { autoInjectable } from "tsyringe";
import { Staff, UserType } from "@prisma/client";
import ServerConfig from "~/config/ServerConfig";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import UserReadCache from "~/api/modules/user/cache/UserRead.cache";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StaffReadCache from "~/api/modules/staff/cache/StaffRead.cache";
import { StaffCreateRequestType } from "~/api/modules/staff/types/StaffTypes";
import UserReadProvider from "~/api/modules/user/providers/UserRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import UserCreateProvider from "~/api/modules/user/providers/UserCreate.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import StaffCreateProvider from "~/api/modules/staff/providers/StaffCreate.provider";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import SubjectReadProvider from "~/api/modules/subject/providers/SubjectRead.provider";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { ERROR, SUBJECT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { SUCCESS, STAFF_RESOURCE, SOMETHING_WENT_WRONG } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_RECORD_ALREADY_EXISTS, RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class StaffCreateService extends BaseService<IRequest> {
  static serviceName = "StaffCreateService";
  staffCreateProvider: StaffCreateProvider;
  userReadProvider: UserReadProvider;
  userCreateProvider: UserCreateProvider;
  loggingProvider: ILoggingDriver;
  staffReadCache: StaffReadCache;
  userReadCache: UserReadCache;
  subjectReadProvider: SubjectReadProvider;
  constructor(staffCreateProvider: StaffCreateProvider, userReadProvider: UserReadProvider, userCreateProvider: UserCreateProvider, staffReadCache: StaffReadCache, userReadCache: UserReadCache, subjectReadProvider: SubjectReadProvider) {
    super(StaffCreateService.serviceName);
    this.staffCreateProvider = staffCreateProvider;
    this.userReadProvider = userReadProvider;
    this.userCreateProvider = userCreateProvider;
    this.staffReadCache = staffReadCache;
    this.userReadCache = userReadCache;
    this.subjectReadProvider = subjectReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const criteria = { tenantId: args.body.tenantId, email: args.body.email };

      const foundUser = await this.userReadCache.getOneByCriteria(criteria);
      if (foundUser) {
        throw new BadRequestError(RESOURCE_RECORD_ALREADY_EXISTS(STAFF_RESOURCE));
      }

      // Validate subjectIds within the transaction
      if (args.body.subjectIds?.length) {
        const validSubjects = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId });
        const validSubjectIds = validSubjects.map((subject) => subject.id);
        const invalidSubjectIds = args.body.subjectIds.filter((id: number) => !validSubjectIds.includes(id));

        if (invalidSubjectIds.length > 0) {
          throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(SUBJECT_RESOURCE));
        }
      }

      const hashedPassword = PasswordEncryptionService.hashPassword(ServerConfig.Params.Security.DefaultPassword.Staff);

      const userCreateArgs = { ...args.body, password: hashedPassword, userType: UserType.STAFF };

      const createdStaffUser = await this.createUserAndStaffTransaction(userCreateArgs);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(STAFF_RESOURCE), createdStaffUser);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async createBulk(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId, staffs } = args.body;

      const hashedPassword = PasswordEncryptionService.hashPassword(ServerConfig.Params.Security.DefaultPassword.Staff);

      const userCreateArgs = staffs.map((staff: Staff) => ({
        ...staff,
        password: hashedPassword,
        userType: UserType.STAFF,
        tenantId,
      }));

      const createdStaffUser = await this.createBulkUserAndStaffTransaction(userCreateArgs, tenantId);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(STAFF_RESOURCE), createdStaffUser);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async createUserAndStaffTransaction(args: StaffCreateRequestType & { password: string; userType: UserType }) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const user = await this.userCreateProvider.create(args, tx);
        await this.userReadCache.invalidate(args.tenantId);

        const userArgs = {
          ...args,
          userId: user?.id,
          startDate: args.startDate ? args.startDate.toISOString() : undefined,
        };

        const staff = await this.staffCreateProvider.create(userArgs, tx);
        await this.staffReadCache.invalidate(args.tenantId);

        return staff;
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }

  private async createBulkUserAndStaffTransaction(args: (StaffCreateRequestType & { password: string; userType: UserType })[], tenantId: number) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const userArgs = args.map((staff) => ({
          tenantId,
          email: staff.email,
          gender: staff.gender,
          lastName: staff.lastName,
          password: staff.password,
          userType: staff.userType,
          firstName: staff.firstName,
          phoneNumber: staff.phoneNumber,
        }));

        await this.userCreateProvider.createMany(userArgs, tx);
        await this.userReadCache.invalidate(tenantId);

        const emails = args.map((s) => s.email);
        const foundUsers = await this.userReadProvider.getByCriteria({ tenantId, emails }, tx);

        const userMap = new Map(foundUsers?.map((user) => [user.email, user.id]));

        const staffData = args.map((staff) => ({
          jobTitle: staff.jobTitle,
          nin: staff.nin,
          tenantId: tenantId,
          userId: userMap.get(staff.email)!,
        }));

        await this.staffCreateProvider.createMany(staffData, tx);
        await this.staffReadCache.invalidate(tenantId);
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
