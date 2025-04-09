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
var SubjectCreateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const Base_service_1 = require("../../base/services/Base.service");
const SubjectRead_provider_1 = __importDefault(require("../providers/SubjectRead.provider"));
const SubjectCreate_provider_1 = __importDefault(require("../providers/SubjectCreate.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
let SubjectCreateService = SubjectCreateService_1 = class SubjectCreateService extends Base_service_1.BaseService {
    constructor(subjectCreateProvider, subjectReadProvider) {
        super(SubjectCreateService_1.serviceName);
        this.subjectCreateProvider = subjectCreateProvider;
        this.subjectReadProvider = subjectReadProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args);
            const foundSubject = await this.subjectReadProvider.getOneByCriteria(args.body);
            if (foundSubject) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_ALREADY_EXISTS)(SystemMessages_1.SUBJECT_RESOURCE));
            }
            const subject = await this.subjectCreateProvider.create(args.body);
            trace.setSuccessful();
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED, (0, SystemMessagesFunction_1.RESOURCE_RECORD_CREATED_SUCCESSFULLY)(SystemMessages_1.SUBJECT_RESOURCE), subject);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
};
SubjectCreateService.serviceName = "SubjectCreateService";
SubjectCreateService = SubjectCreateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [SubjectCreate_provider_1.default, SubjectRead_provider_1.default])
], SubjectCreateService);
exports.default = SubjectCreateService;
//# sourceMappingURL=SubjectCreate.service.js.map