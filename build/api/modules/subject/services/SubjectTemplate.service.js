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
var SubjectTemplateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const Base_service_1 = require("../../base/services/Base.service");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const ClassRead_cache_1 = __importDefault(require("../../class/cache/ClassRead.cache"));
const StaffRead_cache_1 = __importDefault(require("../../staff/cache/StaffRead.cache"));
let SubjectTemplateService = SubjectTemplateService_1 = class SubjectTemplateService extends Base_service_1.BaseService {
    constructor(staffReadCache, classReadCache) {
        super(SubjectTemplateService_1.serviceName);
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
        this.staffReadCache = staffReadCache;
        this.classReadCache = classReadCache;
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args?.body);
            const staffs = await this.staffReadCache.getByCriteria({
                tenantId: args.body.tenantId,
            });
            const classes = await this.classReadCache.getByCriteria({ tenantId: args.body.tenantId });
            const data = {
                staffOptions: staffs,
                classOptions: classes,
            };
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_FETCHED_SUCCESSFULLY)(SystemMessages_1.TEMPLATE_RESOURCE), data);
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
SubjectTemplateService.serviceName = "SubjectTemplateService";
SubjectTemplateService = SubjectTemplateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [StaffRead_cache_1.default, ClassRead_cache_1.default])
], SubjectTemplateService);
exports.default = SubjectTemplateService;
//# sourceMappingURL=SubjectTemplate.service.js.map