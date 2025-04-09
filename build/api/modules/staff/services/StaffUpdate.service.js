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
var StaffUpdateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const StaffRead_cache_1 = __importDefault(require("../cache/StaffRead.cache"));
const UserRead_cache_1 = __importDefault(require("../../user/cache/UserRead.cache"));
const Base_service_1 = require("../../base/services/Base.service");
const StaffRead_provider_1 = __importDefault(require("../providers/StaffRead.provider"));
const StaffUpdate_provider_1 = __importDefault(require("../providers/StaffUpdate.provider"));
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const UserUpdate_provider_1 = __importDefault(require("../../user/providers/UserUpdate.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessages_2 = require("../../../shared/helpers/messages/SystemMessages");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const SubjectRead_provider_1 = __importDefault(require("../../subject/providers/SubjectRead.provider"));
let StaffUpdateService = StaffUpdateService_1 = class StaffUpdateService extends Base_service_1.BaseService {
    constructor(staffUpdateProvider, staffReadProvider, userUpdateProvider, userReadCache, staffReadCache, subjectReadProvider) {
        super(StaffUpdateService_1.serviceName);
        this.staffReadProvider = staffReadProvider;
        this.staffUpdateProvider = staffUpdateProvider;
        this.userUpdateProvider = userUpdateProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
        this.userReadCache = userReadCache;
        this.staffReadCache = staffReadCache;
        this.subjectReadProvider = subjectReadProvider;
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args);
            const foundUser = await this.userReadCache.getOneByCriteria({ tenantId: Number(args.body.tenantId), userId: Number(args.body.id) });
            if (!foundUser) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_2.STAFF_RESOURCE), HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
            }
            // Validate subjectIds within the transaction
            if (args.body.subjectIds?.length) {
                const validSubjects = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId });
                const validSubjectIds = validSubjects.map((subject) => subject.id);
                const invalidSubjectIds = args.body.subjectIds.filter((id) => !validSubjectIds.includes(id));
                if (invalidSubjectIds.length > 0) {
                    throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_1.SUBJECT_RESOURCE));
                }
            }
            const result = await this.updateStaffTransaction({ ...args.body, staffId: Number(args.params.id), id: foundUser.id });
            trace.setSuccessful();
            this.result.setData(SystemMessages_2.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_RECORD_UPDATED_SUCCESSFULLY)(SystemMessages_2.STAFF_RESOURCE), result);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async updateMany(trace, args) {
        try {
            this.initializeServiceTrace(trace, args);
            const foundStaffs = await this.staffReadProvider.getByCriteria({ ids: args.ids, tenantId: args.tenantId });
            if (!foundStaffs.length) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_2.STAFF_RESOURCE), HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
            }
            const staffs = await this.staffUpdateProvider.updateMany(args);
            await this.staffReadCache.invalidate(args.tenantId);
            trace.setSuccessful();
            this.result.setData(SystemMessages_2.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED, `Updated Staffs Information`, staffs);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async updateStaffTransaction(args) {
        try {
            const result = await database_1.default.$transaction(async (tx) => {
                const user = await this.userUpdateProvider.updateOneByCriteria({ ...args, userId: Number(args.id) }, tx);
                const staff = await this.staffUpdateProvider.updateOne({ ...args, id: args.staffId }, tx);
                await this.userReadCache.invalidate(args.tenantId);
                await this.staffReadCache.invalidate(args.tenantId);
                return { ...staff };
            });
            return result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            throw new InternalServerError_1.InternalServerError(SystemMessages_2.SOMETHING_WENT_WRONG);
        }
    }
};
StaffUpdateService.serviceName = "StaffUpdateService";
StaffUpdateService = StaffUpdateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [StaffUpdate_provider_1.default, StaffRead_provider_1.default, UserUpdate_provider_1.default, UserRead_cache_1.default, StaffRead_cache_1.default, SubjectRead_provider_1.default])
], StaffUpdateService);
exports.default = StaffUpdateService;
//# sourceMappingURL=StaffUpdate.service.js.map