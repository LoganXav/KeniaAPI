import { DateTime } from "luxon";
import { autoInjectable } from "tsyringe";
import Event from "~/api/shared/helpers/events";
import TokenProvider from "../providers/Token.provider";
import { businessConfig } from "~/config/BusinessConfig";
import UserReadCache from "../../user/cache/UserRead.cache";
import ClassReadCache from "../../class/cache/ClassRead.cache";
import StaffReadCache from "../../staff/cache/StaffRead.cache";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { generateStringOfLength } from "~/utils/GenerateStringOfLength";
import { eventTypes } from "~/api/shared/helpers/enums/EventTypes.enum";
import RoleCreateProvider from "../../role/providers/RoleCreate.provider";
import StaffCreateProvider from "../../staff/providers/StaffCreate.provider";
import ClassCreateProvider from "../../class/providers/ClassCreate.provider";
import UserReadProvider from "~/api/modules/user/providers/UserRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import UserCreateProvider from "~/api/modules/user/providers/UserCreate.provider";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { TokenType, UserType, StaffEmploymentType, ClassList } from "@prisma/client";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import TenantCreateProvider from "~/api/modules/tenant/providers/TenantCreate.provider";
import { CreateUserRecordType, SignUpUserType } from "~/api/modules/user/types/UserTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { PasswordEncryptionService } from "~/api/shared/services/encryption/PasswordEncryption.service";
import { ACCOUNT_CREATED, EMAIL_IN_USE, ERROR, SCHOOL_OWNER_ROLE_NAME, SCHOOL_OWNER_ROLE_RANK, SOMETHING_WENT_WRONG, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class AuthSignUpService extends BaseService<CreateUserRecordType> {
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
  }

  public async execute(trace: ServiceTrace, args: CreateUserRecordType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["password"]);
      const foundUser = await this.userReadProvider.getOneByCriteria({ email: args.email });
      if (foundUser) {
        throw new BadRequestError(EMAIL_IN_USE);
      }

      const hashedPassword = PasswordEncryptionService.hashPassword(args.password);

      const input = { ...args, password: hashedPassword };

      const data = await this.createTenantAndUserRecordWithTokenTransaction(input);

      const { user, otpToken } = data;

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
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const tenant = await this.tenantCreateProvider.create(null, tx);

        await this.seedClassesForTenant(tenant.id, tx);

        const userCreateInput = { tenantId: tenant?.id, ...args, userType: UserType.STAFF };
        const user = await this.userCreateProvider.create(userCreateInput, tx);
        await this.userReadCache.invalidate(user?.tenantId);

        const roleCreateInput = { name: SCHOOL_OWNER_ROLE_NAME, rank: SCHOOL_OWNER_ROLE_RANK, permissions: [], tenantId: tenant?.id };
        const role = await this.roleCreateProvider.createRole(roleCreateInput, tx);

        const staffCreateInput = { jobTitle: SCHOOL_OWNER_ROLE_NAME, userId: user?.id, roleId: role?.id, tenantId: tenant?.id, employmentType: StaffEmploymentType.FULLTIME };
        await this.staffCreateProvider.create(staffCreateInput, tx);
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

        return { user, otpToken };
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }

  // REFACTOR TO SEED ON SERVER START IN PROD
  private async seedClassesForTenant(tenantId: number, tx: PrismaTransactionClient) {
    const defaultClasses = Object.values(ClassList).map((name) => ({ name, tenantId }));

    await this.classCreateProvider.createMany(defaultClasses, tx);
    await this.classReadCache.invalidate(tenantId);
  }
}
