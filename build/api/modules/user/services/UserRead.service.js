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
var UserReadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const Base_service_1 = require("../../base/services/Base.service");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const UserRead_cache_1 = __importDefault(require("../cache/UserRead.cache"));
let UserReadService = UserReadService_1 = class UserReadService extends Base_service_1.BaseService {
    constructor(userReadCache) {
        super(UserReadService_1.serviceName);
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
        this.userReadCache = userReadCache;
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args?.body);
            const { userId, tenantId } = args.body;
            const criteria = { userId: Number(userId), tenantId: Number(tenantId) };
            const foundUser = await this.userReadCache.getOneByCriteria({ ...criteria });
            if (foundUser === SystemMessages_1.NULL_OBJECT) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_1.USER_RESOURCE));
            }
            const { password, ...data } = foundUser;
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_FETCHED_SUCCESSFULLY)(SystemMessages_1.USER_RESOURCE), data);
            trace.setSuccessful();
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
};
UserReadService.serviceName = "UserReadService";
UserReadService = UserReadService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [UserRead_cache_1.default])
], UserReadService);
exports.default = UserReadService;
//# sourceMappingURL=UserRead.service.js.map