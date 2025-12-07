import { DateTime } from "luxon";
import { autoInjectable } from "tsyringe";
import Event from "~/api/shared/helpers/events";
import { businessConfig } from "~/config/BusinessConfig";
import QueueProvider from "~/infrastructure/internal/queue";
import { IResult } from "~/api/shared/helpers/results/IResult";
import UserReadCache from "~/api/modules/user/cache/UserRead.cache";
import ClassReadCache from "~/api/modules/class/cache/ClassRead.cache";
import StaffReadCache from "~/api/modules/staff/cache/StaffRead.cache";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { generateStringOfLength } from "~/utils/GenerateStringOfLength";
import TokenProvider from "~/api/modules/auth/providers/Token.provider";
import { eventTypes } from "~/api/shared/helpers/enums/EventTypes.enum";
import { TokenType, UserType, StaffEmploymentType } from "@prisma/client";
import UserReadProvider from "~/api/modules/user/providers/UserRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import UserCreateProvider from "~/api/modules/user/providers/UserCreate.provider";
import RoleCreateProvider from "~/api/modules/role/providers/RoleCreate.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import StaffCreateProvider from "~/api/modules/staff/providers/StaffCreate.provider";
import ClassCreateProvider from "~/api/modules/class/providers/ClassCreate.provider";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { SeedRolesJob, SeedRolesJobData } from "~/api/shared/jobs/seeds/SeedRoles.job";
import TenantCreateProvider from "~/api/modules/tenant/providers/TenantCreate.provider";
import { SignUpUserType } from "~/api/modules/user/types/UserTypes";
import { SeedClassesJob, SeedClassesJobData } from "~/api/shared/jobs/seeds/SeedClasses.job";
import { NormalizedAppError } from "~/infrastructure/internal/exceptions/NormalizedAppError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { SeedPermissionsJob, SeedPermissionsJobData } from "~/api/shared/jobs/seeds/SeedPermissions.job";
import DbClient, { PrismaTransactionClient, TRANSACTION_MAX_WAIT, TRANSACTION_TIMEOUT } from "~/infrastructure/internal/database";
import { ACCOUNT_CREATED, EMAIL_IN_USE, ERROR, SCHOOL_OWNER_ROLE_NAME, SOMETHING_WENT_WRONG, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
@autoInjectable()
export default class AuthSignUpService extends BaseService<SignUpUserType> {
  static serviceName = "AuthSignUpService";
  tokenProvider: TokenProvider;
  userReadCache: UserReadCache;
  staffReadCache: StaffReadCache;
  classReadCache: ClassReadCache;
  loggingProvider: ILoggingDriver;
  userReadProvider: UserReadProvider;
  roleCreateProvider: RoleCreateProvider;
  userCreateProvider: UserCreateProvider;
  staffCreateProvider: StaffCreateProvider;
  classCreateProvider: ClassCreateProvider;
  tenantCreateProvider: TenantCreateProvider;

  constructor(
    tokenProvider: TokenProvider,
    userReadCache: UserReadCache,
    classReadCache: ClassReadCache,
    staffReadCache: StaffReadCache,
    userReadProvider: UserReadProvider,
    userCreateProvider: UserCreateProvider,
    roleCreateProvider: RoleCreateProvider,
    staffCreateProvider: StaffCreateProvider,
    classCreateProvider: ClassCreateProvider,
    tenantCreateProvider: TenantCreateProvider
  ) {
    super(AuthSignUpService.serviceName);
    this.tokenProvider = tokenProvider;
    this.userReadCache = userReadCache;
    this.staffReadCache = staffReadCache;
    this.classReadCache = classReadCache;
    this.userReadProvider = userReadProvider;
    this.userCreateProvider = userCreateProvider;
    this.roleCreateProvider = roleCreateProvider;
    this.staffCreateProvider = staffCreateProvider;
    this.classCreateProvider = classCreateProvider;
    this.tenantCreateProvider = tenantCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();

    QueueProvider.registerWorker("seedClasses", SeedClassesJob.process);
    QueueProvider.registerWorker("seedPermissions", SeedPermissionsJob.process);
    QueueProvider.registerWorker("assignAdminRolePermissions", SeedRolesJob.process);
  }

  public async execute(trace: ServiceTrace, args: SignUpUserType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["password"]);
      const foundUser = await this.userReadProvider.getOneByCriteria({ email: args.email });
      if (foundUser) {
        throw new BadRequestError(EMAIL_IN_USE);
      }

      const hashedPassword = PasswordEncryptionService.hashPassword(args.password);

      const input = { ...args, password: hashedPassword };

      const data = await this.createTenantAndUserRecordWithTokenTransaction(input);

      const { user, otpToken, staffId } = data;

      await QueueProvider.addJob<SeedPermissionsJobData>(
        "seedPermissions",
        "seedPermissionsForTenant",
        { tenantId: user.tenantId },
        {
          attempts: 3,
          priority: 1,
          delay: 0,
        }
      );

      await QueueProvider.addJob<SeedClassesJobData>(
        "seedClasses",
        "seedClassesForTenant",
        { tenantId: user.tenantId },
        {
          attempts: 3,
          priority: 2,
          delay: 0,
        }
      );

      await QueueProvider.addJob<SeedRolesJobData>(
        "assignAdminRolePermissions",
        "assignAdminRolePermissionsForTenant",
        { tenantId: user.tenantId, staffId, userId: user.id },
        {
          attempts: 3,
          priority: 3,
          delay: 0,
        }
      );

      Event.emit(eventTypes.user.signUp, {
        userEmail: user.email,
        activationToken: otpToken,
      });

      const signUpUserData = { id: user.id, tenantId: user.tenantId };

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, ACCOUNT_CREATED, signUpUserData);

      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async createTenantAndUserRecordWithTokenTransaction(args: SignUpUserType) {
    try {
      const result = await DbClient.$transaction(
        async (tx: PrismaTransactionClient) => {
          const tenant = await this.tenantCreateProvider.create({ name: args.name }, tx);

          const userCreateInput = { tenantId: tenant?.id, ...args, userType: UserType.STAFF };
          const user = await this.userCreateProvider.create(userCreateInput, tx);
          await this.userReadCache.invalidate(user?.tenantId);

          const staffCreateInput = { jobTitle: SCHOOL_OWNER_ROLE_NAME, userId: user?.id, tenantId: tenant?.id, employmentType: StaffEmploymentType.Fulltime };
          const staff = await this.staffCreateProvider.create(staffCreateInput, tx);
          await this.staffReadCache.invalidate(user?.tenantId);

          const otpToken = generateStringOfLength(businessConfig.emailTokenLength);
          const expiresAt = DateTime.now().plus({ minutes: businessConfig.emailTokenExpiresInMinutes }).toJSDate();

          await this.tokenProvider.create(
            {
              userId: user.id,
              tokenType: TokenType.EMAIL,
              expiresAt,
              token: otpToken,
            },
            tx
          );

          return { user, otpToken, staffId: staff.id };
        },
        {
          maxWait: TRANSACTION_MAX_WAIT,
          timeout: TRANSACTION_TIMEOUT,
        }
      );
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new NormalizedAppError(error);
    }
  }
}
