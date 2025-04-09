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
var TimetableCreateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const Base_service_1 = require("../../base/services/Base.service");
const TimetableCreate_provider_1 = __importDefault(require("../providers/TimetableCreate.provider"));
const PeriodRead_provider_1 = __importDefault(require("../../period/providers/PeriodRead.provider"));
const PeriodDelete_provider_1 = __importDefault(require("../../period/providers/PeriodDelete.provider"));
const PeriodCreate_provider_1 = __importDefault(require("../../period/providers/PeriodCreate.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
let TimetableCreateService = TimetableCreateService_1 = class TimetableCreateService extends Base_service_1.BaseService {
    constructor(periodReadProvider, periodCreateProvider, periodDeleteProvider, timetableCreateProvider) {
        super(TimetableCreateService_1.serviceName);
        this.periodReadProvider = periodReadProvider;
        this.periodCreateProvider = periodCreateProvider;
        this.periodDeleteProvider = periodDeleteProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
        this.timetableCreateProvider = timetableCreateProvider;
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args);
            const timetable = await this.createTimeTableWithPeriodsTransaction(args);
            trace.setSuccessful();
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED, (0, SystemMessagesFunction_1.RESOURCE_RECORD_CREATED_SUCCESSFULLY)(SystemMessages_1.TIMETABLE_RESOURCE), timetable);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async createTimeTableWithPeriodsTransaction(args) {
        return database_1.default.$transaction(async (tx) => {
            const timetable = await this.timetableCreateProvider.createOrUpdate({
                id: args.id,
                day: args.day,
                classDivisionId: args.classDivisionId,
                tenantId: args.tenantId,
                termId: args.termId,
            }, tx);
            const existingPeriods = await this.periodReadProvider.getByCriteria({
                timetableId: timetable.id,
                tenantId: args.tenantId,
            }, tx);
            const periods = await Promise.all(args.periods.map(async (periodData) => {
                return this.periodCreateProvider.createOrUpdate({
                    id: periodData.id,
                    startTime: periodData.startTime,
                    endTime: periodData.endTime,
                    subjectId: periodData.subjectId,
                    timetableId: timetable.id,
                    isBreak: periodData.isBreak,
                    breakType: periodData.breakType,
                    tenantId: args.tenantId,
                }, tx);
            }));
            // Delete periods not present in the request
            const periodIdsToKeep = args.periods.map((p) => p.id);
            await Promise.all(existingPeriods.filter((p) => !periodIdsToKeep.includes(p.id)).map((p) => this.periodDeleteProvider.delete({ id: p.id, tenantId: args.tenantId }, tx)));
            return { ...timetable, periods };
        });
    }
};
TimetableCreateService.serviceName = "TimetableCreateService";
TimetableCreateService = TimetableCreateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [PeriodRead_provider_1.default, PeriodCreate_provider_1.default, PeriodDelete_provider_1.default, TimetableCreate_provider_1.default])
], TimetableCreateService);
exports.default = TimetableCreateService;
//# sourceMappingURL=TimetableCreate.service.js.map