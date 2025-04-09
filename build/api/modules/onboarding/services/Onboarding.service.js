"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OnboardingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const Base_service_1 = require("../../base/services/Base.service");
const UserUpdate_provider_1 = __importDefault(require("../../../modules/user/providers/UserUpdate.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const TenantUpdate_provider_1 = __importDefault(require("../../tenant/providers/TenantUpdate.provider"));
const client_1 = require("@prisma/client");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const UserRead_cache_1 = __importDefault(require("../../user/cache/UserRead.cache"));
const StaffRead_cache_1 = __importDefault(require("../../staff/cache/StaffRead.cache"));
let OnboardingService = OnboardingService_1 = class OnboardingService extends Base_service_1.BaseService {
    constructor(userUpdateProvider, userReadCache, tenantUpdateProvider, staffReadCache) {
        super(OnboardingService_1.serviceName);
        this.userUpdateProvider = userUpdateProvider;
        this.userReadCache = userReadCache;
        this.staffReadCache = staffReadCache;
        this.tenantUpdateProvider = tenantUpdateProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args.body);
            const { tenantId, userId } = args.body;
            const criteria = { tenantId: Number(tenantId), userId: Number(userId) };
            const foundUser = await this.userReadCache.getOneByCriteria(criteria);
            if (foundUser === SystemMessages_1.NULL_OBJECT) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_1.USER_RESOURCE));
            }
            // Refactor to use role and permission properly
            if (foundUser?.staff?.role?.rank !== SystemMessages_1.SCHOOL_OWNER_ROLE_RANK) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.AUTHORIZATION_REQUIRED);
            }
            const data = await this.updateTenantAndUserOnboardingTransaction(Number(tenantId), args.body, client_1.TenantOnboardingStatusType.RESIDENTIAL);
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_RECORD_UPDATED_SUCCESSFULLY)(SystemMessages_1.USER_RESOURCE), data);
            trace.setSuccessful();
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async residentialInformation(trace, args) {
        try {
            this.initializeServiceTrace(trace, args.body);
            const { tenantId, userId } = args.body;
            const criteria = { tenantId: Number(tenantId), userId: Number(userId) };
            const foundUser = await this.userReadCache.getOneByCriteria(criteria);
            if (foundUser === SystemMessages_1.NULL_OBJECT) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_1.USER_RESOURCE));
            }
            if (foundUser?.staff?.role?.rank !== SystemMessages_1.SCHOOL_OWNER_ROLE_RANK) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.AUTHORIZATION_REQUIRED);
            }
            const data = await this.updateTenantAndUserOnboardingTransaction(Number(tenantId), args.body, client_1.TenantOnboardingStatusType.SCHOOL);
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_RECORD_UPDATED_SUCCESSFULLY)(SystemMessages_1.USER_RESOURCE), data);
            trace.setSuccessful();
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async schoolInformation(trace, args) {
        try {
            this.initializeServiceTrace(trace, args.body);
            const { tenantId, userId } = args.body;
            const criteria = { tenantId: Number(tenantId), userId: Number(userId) };
            const foundUser = await this.userReadCache.getOneByCriteria(criteria);
            if (foundUser === SystemMessages_1.NULL_OBJECT) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_1.USER_RESOURCE));
            }
            if (foundUser?.staff?.role?.rank !== SystemMessages_1.SCHOOL_OWNER_ROLE_RANK) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.AUTHORIZATION_REQUIRED);
            }
            const data = await this.updateTenantAndUserOnboardingTransaction(Number(tenantId), args.body, client_1.TenantOnboardingStatusType.COMPLETE);
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_RECORD_UPDATED_SUCCESSFULLY)(SystemMessages_1.TENANT_RESOURCE), data);
            trace.setSuccessful();
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async updateTenantAndUserOnboardingTransaction(tenantId, args, onboardingStatus) {
        try {
            const result = await database_1.default.$transaction(async (tx) => {
                const user = await this.userUpdateProvider.updateOneByCriteria(args, tx);
                await this.userReadCache.invalidate(tenantId);
                await this.staffReadCache.invalidate(tenantId);
                const updateTenantInput = { ...args, onboardingStatus, tenantId };
                const tenant = await this.tenantUpdateProvider.updateOneByCriteria(updateTenantInput, tx);
                const returnData = onboardingStatus == client_1.TenantOnboardingStatusType.COMPLETE ? tenant : user;
                return { ...returnData };
            });
            return result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            throw new InternalServerError_1.InternalServerError(SystemMessages_1.SOMETHING_WENT_WRONG);
        }
    }
};
OnboardingService.serviceName = "OnboardingService";
OnboardingService = OnboardingService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [UserUpdate_provider_1.default, UserRead_cache_1.default, TenantUpdate_provider_1.default, StaffRead_cache_1.default])
], OnboardingService);
exports.default = OnboardingService;
//# sourceMappingURL=Onboarding.service.js.map