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
var GuardianCreateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const Base_service_1 = require("../../base/services/Base.service");
const GuardianCreate_provider_1 = __importDefault(require("../providers/GuardianCreate.provider"));
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const GuardianRead_provider_1 = __importDefault(require("../providers/GuardianRead.provider"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
let GuardianCreateService = GuardianCreateService_1 = class GuardianCreateService extends Base_service_1.BaseService {
    constructor(guardianCreateProvider, guardianReadProvider) {
        super(GuardianCreateService_1.serviceName);
        this.guardianCreateProvider = guardianCreateProvider;
        this.guardianReadProvider = guardianReadProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args.body);
            const foundGuardian = await this.guardianReadProvider.getOneByCriteria({
                tenantId: args.body.tenantId,
                email: args.body.email,
            });
            if (foundGuardian) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_ALREADY_EXISTS)(SystemMessages_1.GUARDIAN_RESOURCE));
            }
            const guardian = await this.guardianCreateProvider.create(args.body);
            trace.setSuccessful();
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED, (0, SystemMessagesFunction_1.RESOURCE_RECORD_CREATED_SUCCESSFULLY)(SystemMessages_1.GUARDIAN_RESOURCE), guardian);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
};
GuardianCreateService.serviceName = "GuardianCreateService";
GuardianCreateService = GuardianCreateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [GuardianCreate_provider_1.default, GuardianRead_provider_1.default])
], GuardianCreateService);
exports.default = GuardianCreateService;
//# sourceMappingURL=GuardianCreate.service.js.map