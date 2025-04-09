"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AuthSignUpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const tsyringe_1 = require("tsyringe");
const events_1 = __importDefault(require("../../../shared/helpers/events"));
const Token_provider_1 = __importDefault(require("../providers/Token.provider"));
const BusinessConfig_1 = require("../../../../config/BusinessConfig");
const UserRead_cache_1 = __importDefault(require("../../user/cache/UserRead.cache"));
const ClassRead_cache_1 = __importDefault(require("../../class/cache/ClassRead.cache"));
const StaffRead_cache_1 = __importDefault(require("../../staff/cache/StaffRead.cache"));
const Base_service_1 = require("../../../modules/base/services/Base.service");
const GenerateStringOfLength_1 = require("../../../../utils/GenerateStringOfLength");
const EventTypes_enum_1 = require("../../../shared/helpers/enums/EventTypes.enum");
const RoleCreate_provider_1 = __importDefault(require("../../role/providers/RoleCreate.provider"));
const StaffCreate_provider_1 = __importDefault(require("../../staff/providers/StaffCreate.provider"));
const ClassCreate_provider_1 = __importDefault(require("../../class/providers/ClassCreate.provider"));
const UserRead_provider_1 = __importDefault(require("../../../modules/user/providers/UserRead.provider"));
const UserCreate_provider_1 = __importDefault(require("../../../modules/user/providers/UserCreate.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const client_1 = require("@prisma/client");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const database_1 = __importStar(require("../../../../infrastructure/internal/database"));
const TenantCreate_provider_1 = __importDefault(require("../../../modules/tenant/providers/TenantCreate.provider"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const PasswordEncryption_service_1 = require("../../../shared/services/encryption/PasswordEncryption.service");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
let AuthSignUpService = AuthSignUpService_1 = class AuthSignUpService extends Base_service_1.BaseService {
    constructor(tokenProvider, userReadCache, classReadCache, staffReadCache, userReadProvider, userCreateProvider, roleCreateProvider, staffCreateProvider, classCreateProvider, tenantCreateProvider) {
        super(AuthSignUpService_1.serviceName);
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
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args, ["password"]);
            const foundUser = await this.userReadProvider.getOneByCriteria({ email: args.email });
            if (foundUser) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.EMAIL_IN_USE);
            }
            const hashedPassword = PasswordEncryption_service_1.PasswordEncryptionService.hashPassword(args.password);
            const input = { ...args, password: hashedPassword };
            const data = await this.createTenantAndUserRecordWithTokenTransaction(input);
            const { user, otpToken } = data;
            events_1.default.emit(EventTypes_enum_1.eventTypes.user.signUp, {
                userEmail: user.email,
                activationToken: otpToken,
            });
            const signUpUserData = { id: user.id, tenantId: user.tenantId };
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED, SystemMessages_1.ACCOUNT_CREATED, signUpUserData);
            trace.setSuccessful();
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async createTenantAndUserRecordWithTokenTransaction(args) {
        try {
            const result = await database_1.default.$transaction(async (tx) => {
                const tenant = await this.tenantCreateProvider.create(null, tx);
                await this.seedClassesForTenant(tenant.id, tx);
                const userCreateInput = { tenantId: tenant?.id, ...args, userType: client_1.UserType.STAFF };
                const user = await this.userCreateProvider.create(userCreateInput, tx);
                await this.userReadCache.invalidate(user?.tenantId);
                const roleCreateInput = { name: SystemMessages_1.SCHOOL_OWNER_ROLE_NAME, rank: SystemMessages_1.SCHOOL_OWNER_ROLE_RANK, permissions: [], tenantId: tenant?.id };
                const role = await this.roleCreateProvider.createRole(roleCreateInput, tx);
                const staffCreateInput = { jobTitle: SystemMessages_1.SCHOOL_OWNER_ROLE_NAME, userId: user?.id, roleId: role?.id, tenantId: tenant?.id, employmentType: client_1.StaffEmploymentType.FULLTIME };
                await this.staffCreateProvider.create(staffCreateInput, tx);
                await this.staffReadCache.invalidate(user?.tenantId);
                const otpToken = (0, GenerateStringOfLength_1.generateStringOfLength)(BusinessConfig_1.businessConfig.emailTokenLength);
                const expiresAt = luxon_1.DateTime.now().plus({ minutes: BusinessConfig_1.businessConfig.emailTokenExpiresInMinutes }).toJSDate();
                await this.tokenProvider.create({
                    userId: user.id,
                    tokenType: client_1.TokenType.EMAIL,
                    expiresAt,
                    token: otpToken,
                }, tx);
                return { user, otpToken };
            }, {
                maxWait: database_1.TRANSACTION_MAX_WAIT,
                timeout: database_1.TRANSACTION_TIMEOUT,
            });
            return result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            throw new InternalServerError_1.InternalServerError(SystemMessages_1.SOMETHING_WENT_WRONG);
        }
    }
    // REFACTOR TO SEED ON SERVER START IN PROD
    async seedClassesForTenant(tenantId, tx) {
        const defaultClasses = Object.values(client_1.ClassList).map((name) => ({ name, tenantId }));
        await this.classCreateProvider.createMany(defaultClasses, tx);
        await this.classReadCache.invalidate(tenantId);
    }
};
AuthSignUpService.serviceName = "AuthSignUpService";
AuthSignUpService = AuthSignUpService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [Token_provider_1.default,
        UserRead_cache_1.default,
        ClassRead_cache_1.default,
        StaffRead_cache_1.default,
        UserRead_provider_1.default,
        UserCreate_provider_1.default,
        RoleCreate_provider_1.default,
        StaffCreate_provider_1.default,
        ClassCreate_provider_1.default,
        TenantCreate_provider_1.default])
], AuthSignUpService);
exports.default = AuthSignUpService;
//# sourceMappingURL=AuthSignUp.service.js.map