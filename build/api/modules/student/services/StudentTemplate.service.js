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
var StudentTemplateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const ClassRead_cache_1 = __importDefault(require("../../class/cache/ClassRead.cache"));
const Base_service_1 = require("../../base/services/Base.service");
const Gender_constants_1 = __importDefault(require("../../../shared/helpers/constants/Gender.constants"));
const Country_constants_1 = __importDefault(require("../../../shared/helpers/constants/Country.constants"));
const Religion_constants_1 = __importDefault(require("../../../shared/helpers/constants/Religion.constants"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const BloodGroup_constants_1 = __importDefault(require("../../../shared/helpers/constants/BloodGroup.constants"));
const NigerianStates_constant_1 = __importDefault(require("../../../shared/helpers/constants/NigerianStates.constant"));
const GetLocalGovernmentsByCode_1 = require("../../../shared/helpers/constants/GetLocalGovernmentsByCode");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const ClassDivisionRead_provider_1 = __importDefault(require("../../classDivision/providers/ClassDivisionRead.provider"));
const SubjectRead_provider_1 = __importDefault(require("../../subject/providers/SubjectRead.provider"));
let StudentTemplateService = StudentTemplateService_1 = class StudentTemplateService extends Base_service_1.BaseService {
    constructor(classReadCache, classDivisionReadProvider, subjectReadProvider) {
        super(StudentTemplateService_1.serviceName);
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
        this.classReadCache = classReadCache;
        this.classDivisionReadProvider = classDivisionReadProvider;
        this.subjectReadProvider = subjectReadProvider;
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args?.body);
            const { codeValue, classId } = args.query;
            const classes = await this.classReadCache.getByCriteria({ tenantId: args.body.tenantId });
            const classDivision = await this.classDivisionReadProvider.getByCriteria({
                tenantId: args.body.tenantId,
                classId: Number(classId),
            });
            const subjects = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId, classId: Number(classId) });
            const data = {
                classOptions: classes,
                classDivisionOptions: classDivision,
                genderOptions: Gender_constants_1.default,
                religionOptions: Religion_constants_1.default,
                countryIdOptions: Country_constants_1.default,
                stateIdOptions: NigerianStates_constant_1.default,
                bloodGroupOptions: BloodGroup_constants_1.default,
                lgaIdOptions: (0, GetLocalGovernmentsByCode_1.GetLgasByCodeValue)(Number(codeValue)),
                subjectOptions: subjects,
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
StudentTemplateService.serviceName = "StudentTemplateService";
StudentTemplateService = StudentTemplateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [ClassRead_cache_1.default, ClassDivisionRead_provider_1.default, SubjectRead_provider_1.default])
], StudentTemplateService);
exports.default = StudentTemplateService;
//# sourceMappingURL=StudentTemplate.service.js.map