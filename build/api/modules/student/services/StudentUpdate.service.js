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
var StudentUpdateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const StudentRead_cache_1 = __importDefault(require("../cache/StudentRead.cache"));
const UserRead_cache_1 = __importDefault(require("../../user/cache/UserRead.cache"));
const Base_service_1 = require("../../base/services/Base.service");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const StudentUpdate_provider_1 = __importDefault(require("../providers/StudentUpdate.provider"));
const GuardianRead_cache_1 = __importDefault(require("../../guardian/cache/GuardianRead.cache"));
const UserUpdate_provider_1 = __importDefault(require("../../user/providers/UserUpdate.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const GuardianUpdate_provider_1 = __importDefault(require("../../guardian/providers/GuardianUpdate.provider"));
const GuardianCreate_provider_1 = __importDefault(require("../../guardian/providers/GuardianCreate.provider"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessages_2 = require("../../../shared/helpers/messages/SystemMessages");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const SubjectRead_provider_1 = __importDefault(require("../../subject/providers/SubjectRead.provider"));
let StudentUpdateService = StudentUpdateService_1 = class StudentUpdateService extends Base_service_1.BaseService {
    constructor(userReadCache, studentReadCache, guardianReadCache, userUpdateProvider, studentUpdateProvider, guardianUpdateProvider, guardianCreateProvider, subjectReadProvider) {
        super(StudentUpdateService_1.serviceName);
        this.userReadCache = userReadCache;
        this.studentReadCache = studentReadCache;
        this.guardianReadCache = guardianReadCache;
        this.userUpdateProvider = userUpdateProvider;
        this.studentUpdateProvider = studentUpdateProvider;
        this.guardianUpdateProvider = guardianUpdateProvider;
        this.guardianCreateProvider = guardianCreateProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
        this.subjectReadProvider = subjectReadProvider;
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args);
            const foundUser = await this.userReadCache.getOneByCriteria({
                tenantId: Number(args.body.tenantId),
                userId: Number(args.body.id),
            });
            if (!foundUser) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_2.STUDENT_RESOURCE), HttpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST);
            }
            // Validate subjectIds within the transaction
            if (args.body.subjectIds?.length) {
                const validSubjects = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId });
                const validSubjectIds = validSubjects.map((subject) => subject.id);
                const invalidSubjectIds = args.body.subjectIds.filter((id) => !validSubjectIds.includes(id));
                if (invalidSubjectIds.length > 0) {
                    throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_1.SUBJECT_RESOURCE));
                }
            }
            const result = await this.updateStudentTransaction({ ...args.body, studentId: Number(args.params.id), id: foundUser.id });
            trace.setSuccessful();
            this.result.setData(SystemMessages_2.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_RECORD_UPDATED_SUCCESSFULLY)(SystemMessages_2.STUDENT_RESOURCE), result);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async updateMany(trace, args) {
        try {
            this.initializeServiceTrace(trace, args);
            const foundStudents = await this.studentReadCache.getByCriteria({
                ids: args.ids,
                tenantId: args.tenantId,
            });
            if (!foundStudents?.length) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_2.STUDENT_RESOURCE), HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
            }
            const students = await this.studentUpdateProvider.updateMany(args);
            await this.studentReadCache.invalidate(args.tenantId);
            trace.setSuccessful();
            this.result.setData(SystemMessages_2.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, (0, SystemMessagesFunction_1.RESOURCE_RECORD_UPDATED_SUCCESSFULLY)(SystemMessages_2.STUDENT_RESOURCE), students);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async updateStudentTransaction(args) {
        try {
            const result = await database_1.default.$transaction(async (tx) => {
                // Update user-related fields
                await this.userUpdateProvider.updateOneByCriteria({
                    ...args,
                    userId: Number(args.id),
                }, tx);
                // Update or create guardians and collect their IDs
                const guardianIds = [];
                if (args.guardians?.length) {
                    const guardianData = args.guardians.map((guardian) => ({
                        ...guardian,
                        tenantId: args.tenantId,
                    }));
                    for (const guardian of guardianData) {
                        const foundGuardian = await this.guardianReadCache.getOneByCriteria({
                            email: guardian.email,
                            tenantId: args.tenantId,
                        });
                        if (foundGuardian) {
                            guardianIds.push(foundGuardian.id);
                            continue;
                        }
                        if (!guardian.id) {
                            const newGuardian = await this.guardianCreateProvider.create(guardian, tx);
                            guardianIds.push(newGuardian.id);
                        }
                        else {
                            const updatedGuardian = await this.guardianUpdateProvider.update(guardian, tx);
                            guardianIds.push(updatedGuardian.id);
                        }
                    }
                }
                // Update student-specific fields with guardian IDs
                const student = await this.studentUpdateProvider.updateOne({
                    ...args,
                    id: Number(args.studentId),
                    guardianIds,
                }, tx);
                await this.userReadCache.invalidate(args.tenantId);
                await this.studentReadCache.invalidate(args.tenantId);
                await this.guardianReadCache.invalidate(args.tenantId);
                return student;
            });
            return result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            throw new InternalServerError_1.InternalServerError(SystemMessages_2.SOMETHING_WENT_WRONG);
        }
    }
};
StudentUpdateService.serviceName = "StudentUpdateService";
StudentUpdateService = StudentUpdateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [UserRead_cache_1.default,
        StudentRead_cache_1.default,
        GuardianRead_cache_1.default,
        UserUpdate_provider_1.default,
        StudentUpdate_provider_1.default,
        GuardianUpdate_provider_1.default,
        GuardianCreate_provider_1.default,
        SubjectRead_provider_1.default])
], StudentUpdateService);
exports.default = StudentUpdateService;
//# sourceMappingURL=StudentUpdate.service.js.map