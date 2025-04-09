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
var TimetableTemplateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const ClassRead_cache_1 = __importDefault(require("../../class/cache/ClassRead.cache"));
const Base_service_1 = require("../../base/services/Base.service");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const ClassDivisionRead_provider_1 = __importDefault(require("../../classDivision/providers/ClassDivisionRead.provider"));
const SubjectRead_provider_1 = __importDefault(require("../../subject/providers/SubjectRead.provider"));
const client_1 = require("@prisma/client");
const TermRead_provider_1 = __importDefault(require("../../term/providers/TermRead.provider"));
let TimetableTemplateService = TimetableTemplateService_1 = class TimetableTemplateService extends Base_service_1.BaseService {
    constructor(classReadCache, classDivisionReadProvider, subjectReadProvider, termReadProvider) {
        super(TimetableTemplateService_1.serviceName);
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
        this.classReadCache = classReadCache;
        this.classDivisionReadProvider = classDivisionReadProvider;
        this.subjectReadProvider = subjectReadProvider;
        this.termReadProvider = termReadProvider;
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args?.body);
            const { classId } = args.query;
            const classes = await this.classReadCache.getByCriteria({ tenantId: args.body.tenantId });
            const classDivision = await this.classDivisionReadProvider.getByCriteria({
                tenantId: args.body.tenantId,
                classId: Number(classId),
            });
            const subjects = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId, classId: Number(classId) });
            const terms = await this.termReadProvider.getByCriteria({ tenantId: args.body.tenantId });
            const termOptions = terms.map((term) => ({
                name: `${term?.calendar?.year} - ${term.name}`,
                id: term.id,
                startDate: term.startDate,
                endDate: term.endDate,
                tenantId: term.tenantId,
            }));
            const data = {
                classOptions: classes,
                classDivisionOptions: classDivision,
                subjectOptions: subjects,
                dayOptions: Object.values(client_1.Weekday),
                breakTypeOptions: Object.values(client_1.BreakType),
                termOptions,
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
TimetableTemplateService.serviceName = "TimetableTemplateService";
TimetableTemplateService = TimetableTemplateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [ClassRead_cache_1.default, ClassDivisionRead_provider_1.default, SubjectRead_provider_1.default, TermRead_provider_1.default])
], TimetableTemplateService);
exports.default = TimetableTemplateService;
//# sourceMappingURL=TimetableTemplate.service.js.map