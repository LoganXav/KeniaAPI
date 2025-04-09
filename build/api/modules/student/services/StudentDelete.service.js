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
var DeleteStudentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const StudentRead_cache_1 = __importDefault(require("../cache/StudentRead.cache"));
const UserRead_cache_1 = __importDefault(require("../../user/cache/UserRead.cache"));
const Base_service_1 = require("../../base/services/Base.service");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const StudentDelete_provider_1 = __importDefault(require("../providers/StudentDelete.provider"));
const SystemMessages_2 = require("../../../shared/helpers/messages/SystemMessages");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
let DeleteStudentService = DeleteStudentService_1 = class DeleteStudentService extends Base_service_1.BaseService {
    constructor(studentDeleteProvider, studentReadCache, userReadCache) {
        super(DeleteStudentService_1.serviceName);
        this.studentDeleteProvider = studentDeleteProvider;
        this.studentReadCache = studentReadCache;
        this.userReadCache = userReadCache;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args, ["deleteStudent"]);
            const student = await this.studentDeleteProvider.deleteOne(args);
            if (!student) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_2.NOT_FOUND), HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
            }
            await this.studentReadCache.invalidate(args.tenantId);
            await this.userReadCache.invalidate(args.tenantId);
            trace.setSuccessful();
            this.result.setData(SystemMessages_2.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_RECORD_DELETED_SUCCESSFULLY)("Student"), student);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async deleteStudents(trace, args) {
        try {
            this.initializeServiceTrace(trace, args, ["deleteStudents"]);
            const students = await this.studentDeleteProvider.deleteMany(args);
            if (!students.count) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_2.NOT_FOUND), HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
            }
            await this.studentReadCache.invalidate(args.tenantId);
            await this.userReadCache.invalidate(args.tenantId);
            trace.setSuccessful();
            this.result.setData(SystemMessages_2.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_RECORD_DELETED_SUCCESSFULLY)("Students"), students);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
};
DeleteStudentService.serviceName = "DeleteStudentService";
DeleteStudentService = DeleteStudentService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [StudentDelete_provider_1.default, StudentRead_cache_1.default, UserRead_cache_1.default])
], DeleteStudentService);
exports.default = DeleteStudentService;
//# sourceMappingURL=StudentDelete.service.js.map