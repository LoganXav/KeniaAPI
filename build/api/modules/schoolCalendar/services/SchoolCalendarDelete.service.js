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
var SchoolCalendarDeleteService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const Base_service_1 = require("../../base/services/Base.service");
const SchoolCalendarDelete_provider_1 = __importDefault(require("../providers/SchoolCalendarDelete.provider"));
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const TermRead_provider_1 = __importDefault(require("../../term/providers/TermRead.provider"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
let SchoolCalendarDeleteService = SchoolCalendarDeleteService_1 = class SchoolCalendarDeleteService extends Base_service_1.BaseService {
    constructor(schoolCalendarDeleteProvider, termReadProvider) {
        super(SchoolCalendarDeleteService_1.serviceName);
        this.schoolCalendarDeleteProvider = schoolCalendarDeleteProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
        this.termReadProvider = termReadProvider;
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args);
            const existingTerms = await this.termReadProvider.getOneByCriteria({ calendarId: args.id, tenantId: args.tenantId });
            if (existingTerms) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND_WITH_ID)(SystemMessages_1.TERM_RESOURCE));
            }
            const schoolCalendar = await this.schoolCalendarDeleteProvider.delete(args);
            trace.setSuccessful();
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_RECORD_DELETED_SUCCESSFULLY)(SystemMessages_1.SCHOOL_CALENDAR_RESOURCE), schoolCalendar);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
};
SchoolCalendarDeleteService.serviceName = "SchoolCalendarDeleteService";
SchoolCalendarDeleteService = SchoolCalendarDeleteService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [SchoolCalendarDelete_provider_1.default, TermRead_provider_1.default])
], SchoolCalendarDeleteService);
exports.default = SchoolCalendarDeleteService;
//# sourceMappingURL=SchoolCalendarDelete.service.js.map