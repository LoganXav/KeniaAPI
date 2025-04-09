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
var TimetableReadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const Base_service_1 = require("../../base/services/Base.service");
const TimetableRead_provider_1 = __importDefault(require("../providers/TimetableRead.provider"));
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const TermRead_provider_1 = __importDefault(require("../../../modules/term/providers/TermRead.provider"));
const date_fns_1 = require("date-fns");
const NotFoundError_1 = require("../../../../infrastructure/internal/exceptions/NotFoundError");
let TimetableReadService = TimetableReadService_1 = class TimetableReadService extends Base_service_1.BaseService {
    constructor(timetableReadProvider, termReadProvider) {
        super(TimetableReadService_1.serviceName);
        this.timetableReadProvider = timetableReadProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
        this.termReadProvider = termReadProvider;
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args.query);
            const termInfo = await this.termReadProvider.getOneByCriteria({ id: args.query.termId, tenantId: args.body.tenantId });
            if (!termInfo)
                throw new NotFoundError_1.NotFoundError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_1.TERM_RESOURCE));
            const timetables = await this.timetableReadProvider.getByCriteria({ classDivisionId: Number(args.query.classDivisionId), tenantId: args.body.tenantId });
            const timedPeriods = this.transformTimetableInTermToTimedPeriods(termInfo, timetables);
            trace.setSuccessful();
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_FETCHED_SUCCESSFULLY)(SystemMessages_1.TIMETABLE_RESOURCE), timedPeriods);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async readOne(trace, args) {
        try {
            this.initializeServiceTrace(trace, args?.query);
            const timetable = await this.timetableReadProvider.getOneByCriteria({ ...args.query, tenantId: args.body.tenantId });
            trace.setSuccessful();
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_FETCHED_SUCCESSFULLY)(SystemMessages_1.TIMETABLE_RESOURCE), timetable);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    transformTimetableInTermToTimedPeriods(term, timetables) {
        const timedPeriods = [];
        timetables.forEach((timetable) => {
            const validDates = this.getWeekdayDatesBetween(new Date(term.startDate), new Date(term.endDate), timetable.day).filter((date) => {
                const isBreak = this.checkIsDateInBreakWeeks(date, term.breakWeeks);
                return !isBreak;
            });
            validDates.forEach((date) => {
                timetable.periods.forEach((period) => {
                    // Fix the parsing of the time string
                    const startTime = period.startTime.split("T")[1]; // Get the time part after 'T'
                    const endTime = period.endTime.split("T")[1];
                    const [startHour, startMin] = startTime.split(":");
                    const [endHour, endMin] = endTime.split(":");
                    // Create new dates
                    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(startHour), parseInt(startMin), 0);
                    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(endHour), parseInt(endMin), 0);
                    // TODO: Pass date format string from the frontend
                    // Format using date-fns for consistent output
                    const formattedStart = (0, date_fns_1.format)(startDate, "yyyy-MM-dd'T'HH:mm:ss");
                    const formattedEnd = (0, date_fns_1.format)(endDate, "yyyy-MM-dd'T'HH:mm:ss");
                    timedPeriods.push({
                        start: formattedStart,
                        end: formattedEnd,
                        title: period.isBreak ? period.breakType : period.subject?.name || "Unassigned",
                    });
                });
            });
        });
        return timedPeriods;
    }
    // Helper to check if the date is in the break weeks
    checkIsDateInBreakWeeks(date, breakWeeks) {
        // Normalize the date to start of day for comparison
        const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return breakWeeks.some((breakWeek) => {
            const breakStart = new Date(breakWeek.startDate);
            const breakEnd = new Date(breakWeek.endDate);
            // Normalize break dates to start of day
            const normalizedBreakStart = new Date(breakStart.getFullYear(), breakStart.getMonth(), breakStart.getDate());
            const normalizedBreakEnd = new Date(breakEnd.getFullYear(), breakEnd.getMonth(), breakEnd.getDate());
            const isInBreak = normalizedDate >= normalizedBreakStart && normalizedDate <= normalizedBreakEnd;
            return isInBreak;
        });
    }
    // Helper to get all dates for a specific weekday between start and end dates of the term
    getWeekdayDatesBetween(start, end, weekday) {
        const weekdayMap = {
            MONDAY: 1,
            TUESDAY: 2,
            WEDNESDAY: 3,
            THURSDAY: 4,
            FRIDAY: 5,
        };
        const dates = (0, date_fns_1.eachDayOfInterval)({ start, end })
            .filter((date) => !(0, date_fns_1.isWeekend)(date))
            .filter((date) => date.getDay() === weekdayMap[weekday]);
        return dates;
    }
};
TimetableReadService.serviceName = "TimetableReadService";
TimetableReadService = TimetableReadService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [TimetableRead_provider_1.default, TermRead_provider_1.default])
], TimetableReadService);
exports.default = TimetableReadService;
//# sourceMappingURL=TimetableRead.service.js.map