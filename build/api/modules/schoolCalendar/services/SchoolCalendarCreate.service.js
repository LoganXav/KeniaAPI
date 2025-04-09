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
var SchoolCalendarCreateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const Base_service_1 = require("../../base/services/Base.service");
const TermRead_provider_1 = __importDefault(require("../../term/providers/TermRead.provider"));
const TermCreate_provider_1 = __importDefault(require("../../term/providers/TermCreate.provider"));
const TermDelete_provider_1 = __importDefault(require("../../term/providers/TermDelete.provider"));
const SchoolCalendarRead_provider_1 = __importDefault(require("../providers/SchoolCalendarRead.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const SchoolCalendarCreate_provider_1 = __importDefault(require("../providers/SchoolCalendarCreate.provider"));
const BreakPeriodCreate_provider_1 = __importDefault(require("../../breakPeriod/providers/BreakPeriodCreate.provider"));
const BreakPeriodDelete_provider_1 = __importDefault(require("../../breakPeriod/providers/BreakPeriodDelete.provider"));
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
let SchoolCalendarCreateService = SchoolCalendarCreateService_1 = class SchoolCalendarCreateService extends Base_service_1.BaseService {
    constructor(termReadProvider, termDeleteProvider, termCreateProvider, breakPeriodDeleteProvider, breakPeriodCreateProvider, schoolCalendarReadProvider, schoolCalendarCreateProvider) {
        super(SchoolCalendarCreateService_1.serviceName);
        this.termReadProvider = termReadProvider;
        this.termCreateProvider = termCreateProvider;
        this.termDeleteProvider = termDeleteProvider;
        this.breakPeriodCreateProvider = breakPeriodCreateProvider;
        this.breakPeriodDeleteProvider = breakPeriodDeleteProvider;
        this.schoolCalendarReadProvider = schoolCalendarReadProvider;
        this.schoolCalendarCreateProvider = schoolCalendarCreateProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args);
            const schoolCalendar = await this.schoolCalendarCreateTransaction(args);
            const result = await this.schoolCalendarReadProvider.getOneByCriteria({ id: schoolCalendar.id });
            trace.setSuccessful();
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED, (0, SystemMessagesFunction_1.RESOURCE_RECORD_CREATED_SUCCESSFULLY)(SystemMessages_1.SCHOOL_CALENDAR_RESOURCE), result);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async schoolCalendarCreateTransaction(args) {
        return database_1.default.$transaction(async (tx) => {
            const schoolCalendar = await this.schoolCalendarCreateProvider.createOrUpdate({
                id: args.id,
                year: args.year,
                tenantId: args.tenantId,
            }, tx);
            const existingTerms = await this.termReadProvider.getByCriteria({ calendarId: schoolCalendar.id, tenantId: args.tenantId }, tx);
            const terms = await Promise.all(args.terms.map(async (termData) => {
                const term = await this.termCreateProvider.createOrUpdate({
                    id: termData.id,
                    name: termData.name,
                    startDate: termData.startDate,
                    endDate: termData.endDate,
                    calendarId: schoolCalendar.id,
                    tenantId: args.tenantId,
                }, tx);
                const breakWeeks = await Promise.all(termData.breakWeeks.map(async (breakData) => {
                    return this.breakPeriodCreateProvider.createOrUpdate({
                        id: breakData.id,
                        name: breakData.name,
                        startDate: breakData.startDate,
                        endDate: breakData.endDate,
                        termId: term.id,
                        tenantId: args.tenantId,
                    }, tx);
                }));
                return { ...term, breakWeeks };
            }));
            // Delete terms not present in the request
            const termIdsToKeep = args.terms.map((t) => t.id);
            await Promise.all(existingTerms
                .filter((t) => !termIdsToKeep.includes(t.id))
                .map(async (t) => {
                await Promise.all(t.breakWeeks.map((bw) => this.breakPeriodDeleteProvider.delete({ id: bw.id, tenantId: args.tenantId }, tx)));
                return this.termDeleteProvider.delete({ id: t.id, tenantId: args.tenantId }, tx);
            }));
            // Delete break periods not present in the request for existing and passed terms
            await Promise.all(existingTerms.map(async (existingTerm) => {
                const passedTerm = args.terms.find((t) => t.id === existingTerm.id);
                if (passedTerm) {
                    const breakPeriodIdsToKeep = passedTerm.breakWeeks.map((bw) => bw.id);
                    await Promise.all(existingTerm.breakWeeks.filter((bw) => !breakPeriodIdsToKeep.includes(bw.id)).map((bw) => this.breakPeriodDeleteProvider.delete({ id: bw.id, tenantId: args.tenantId }, tx)));
                }
            }));
            return { ...schoolCalendar, terms };
        });
    }
};
SchoolCalendarCreateService.serviceName = "SchoolCalendarCreateService";
SchoolCalendarCreateService = SchoolCalendarCreateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [TermRead_provider_1.default,
        TermDelete_provider_1.default,
        TermCreate_provider_1.default,
        BreakPeriodDelete_provider_1.default,
        BreakPeriodCreate_provider_1.default,
        SchoolCalendarRead_provider_1.default,
        SchoolCalendarCreate_provider_1.default])
], SchoolCalendarCreateService);
exports.default = SchoolCalendarCreateService;
//# sourceMappingURL=SchoolCalendarCreate.service.js.map