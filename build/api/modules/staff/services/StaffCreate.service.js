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
var StaffCreateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
const ServerConfig_1 = __importDefault(require("../../../../config/ServerConfig"));
const StaffRead_cache_1 = __importDefault(require("../cache/StaffRead.cache"));
const UserRead_cache_1 = __importDefault(require("../../user/cache/UserRead.cache"));
const Base_service_1 = require("../../base/services/Base.service");
const StaffCreate_provider_1 = __importDefault(require("../providers/StaffCreate.provider"));
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const UserRead_provider_1 = __importDefault(require("../../user/providers/UserRead.provider"));
const UserCreate_provider_1 = __importDefault(require("../../user/providers/UserCreate.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const PasswordEncryption_service_1 = require("../../../shared/services/encryption/PasswordEncryption.service");
const SystemMessages_2 = require("../../../shared/helpers/messages/SystemMessages");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const SubjectRead_provider_1 = __importDefault(require("../../subject/providers/SubjectRead.provider"));
let StaffCreateService = StaffCreateService_1 = class StaffCreateService extends Base_service_1.BaseService {
    constructor(staffCreateProvider, userReadProvider, userCreateProvider, staffReadCache, userReadCache, subjectReadProvider) {
        super(StaffCreateService_1.serviceName);
        this.staffCreateProvider = staffCreateProvider;
        this.userReadProvider = userReadProvider;
        this.userCreateProvider = userCreateProvider;
        this.staffReadCache = staffReadCache;
        this.userReadCache = userReadCache;
        this.subjectReadProvider = subjectReadProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args.body);
            const criteria = { tenantId: args.body.tenantId, email: args.body.email };
            const foundUser = await this.userReadCache.getOneByCriteria(criteria);
            if (foundUser) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_ALREADY_EXISTS)(SystemMessages_2.STAFF_RESOURCE));
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
            const hashedPassword = PasswordEncryption_service_1.PasswordEncryptionService.hashPassword(ServerConfig_1.default.Params.Security.DefaultPassword.Staff);
            const userCreateArgs = { ...args.body, password: hashedPassword, userType: client_1.UserType.STAFF };
            const createdStaffUser = await this.createUserAndStaffTransaction(userCreateArgs);
            trace.setSuccessful();
            this.result.setData(SystemMessages_2.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED, (0, SystemMessagesFunction_1.RESOURCE_RECORD_CREATED_SUCCESSFULLY)(SystemMessages_2.STAFF_RESOURCE), createdStaffUser);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async createUserAndStaffTransaction(args) {
        try {
            const result = await database_1.default.$transaction(async (tx) => {
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
        }
        catch (error) {
            this.loggingProvider.error(error);
            throw new InternalServerError_1.InternalServerError(SystemMessages_2.SOMETHING_WENT_WRONG);
        }
    }
};
StaffCreateService.serviceName = "StaffCreateService";
StaffCreateService = StaffCreateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [StaffCreate_provider_1.default, UserRead_provider_1.default, UserCreate_provider_1.default, StaffRead_cache_1.default, UserRead_cache_1.default, SubjectRead_provider_1.default])
], StaffCreateService);
exports.default = StaffCreateService;
//# sourceMappingURL=StaffCreate.service.js.map