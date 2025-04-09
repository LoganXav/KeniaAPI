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
var ClassCreateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const Base_service_1 = require("../../base/services/Base.service");
const ClassCreate_provider_1 = __importDefault(require("../providers/ClassCreate.provider"));
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const ClassRead_cache_1 = __importDefault(require("../cache/ClassRead.cache"));
const SystemMessagesFunction_2 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
let ClassCreateService = ClassCreateService_1 = class ClassCreateService extends Base_service_1.BaseService {
    constructor(classCreateProvider, classReadCache) {
        super(ClassCreateService_1.serviceName);
        this.classCreateProvider = classCreateProvider;
        this.classReadCache = classReadCache;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args);
            const foundClass = await this.classReadCache.getOneByCriteria(args);
            if (foundClass) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_2.RESOURCE_RECORD_ALREADY_EXISTS)(SystemMessages_1.CLASS_RESOURCE));
            }
            const classRecord = await this.classCreateProvider.create(args);
            trace.setSuccessful();
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED, (0, SystemMessagesFunction_1.RESOURCE_RECORD_CREATED_SUCCESSFULLY)(SystemMessages_1.CLASS_RESOURCE), classRecord);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
};
ClassCreateService.serviceName = "ClassCreateService";
ClassCreateService = ClassCreateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [ClassCreate_provider_1.default, ClassRead_cache_1.default])
], ClassCreateService);
exports.default = ClassCreateService;
//# sourceMappingURL=ClassCreate.service.js.map