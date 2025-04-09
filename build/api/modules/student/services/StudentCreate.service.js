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
var StudentCreateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
const ServerConfig_1 = __importDefault(require("../../../../config/ServerConfig"));
const StudentRead_cache_1 = __importDefault(require("../cache/StudentRead.cache"));
const UserRead_cache_1 = __importDefault(require("../../user/cache/UserRead.cache"));
const Base_service_1 = require("../../base/services/Base.service");
const GuardianRead_cache_1 = __importDefault(require("../../guardian/cache/GuardianRead.cache"));
const StudentCreate_provider_1 = __importDefault(require("../providers/StudentCreate.provider"));
const UserCreate_provider_1 = __importDefault(require("../../user/providers/UserCreate.provider"));
const SubjectRead_provider_1 = __importDefault(require("../../subject/providers/SubjectRead.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const GuardianUpdate_provider_1 = __importDefault(require("../../guardian/providers/GuardianUpdate.provider"));
const GuardianCreate_provider_1 = __importDefault(require("../../guardian/providers/GuardianCreate.provider"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const PasswordEncryption_service_1 = require("../../../shared/services/encryption/PasswordEncryption.service");
const SystemMessages_2 = require("../../../shared/helpers/messages/SystemMessages");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
let StudentCreateService = StudentCreateService_1 = class StudentCreateService extends Base_service_1.BaseService {
    constructor(studentCreateProvider, userCreateProvider, studentReadCache, userReadCache, guardianCreateProvider, guardianReadCache, guardianUpdateProvider, subjectReadProvider) {
        super(StudentCreateService_1.serviceName);
        this.userReadCache = userReadCache;
        this.studentReadCache = studentReadCache;
        this.guardianReadCache = guardianReadCache;
        this.userCreateProvider = userCreateProvider;
        this.studentCreateProvider = studentCreateProvider;
        this.guardianCreateProvider = guardianCreateProvider;
        this.guardianUpdateProvider = guardianUpdateProvider;
        this.subjectReadProvider = subjectReadProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args.body);
            const criteria = { tenantId: args.body.tenantId, email: args.body.email };
            // Check if student exists
            const foundUser = await this.userReadCache.getOneByCriteria(criteria);
            if (foundUser) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_ALREADY_EXISTS)(SystemMessages_2.STUDENT_RESOURCE));
            }
            // Check if any guardian emails already exist
            if (args.body.guardians?.length) {
                for (const guardianData of args.body.guardians) {
                    const existingGuardian = await this.userReadCache.getOneByCriteria({
                        tenantId: args.body.tenantId,
                        email: guardianData.email,
                    });
                    if (existingGuardian) {
                        throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_ALREADY_EXISTS)(SystemMessages_2.GUARDIAN_RESOURCE));
                    }
                }
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
            const defaultHashedPassword = PasswordEncryption_service_1.PasswordEncryptionService.hashPassword(ServerConfig_1.default.Params.Security.DefaultPassword.Student);
            const userCreateArgs = { ...args.body, password: defaultHashedPassword, userType: client_1.UserType.STUDENT };
            const createdStudentUser = await this.createUserStudentAndGuardianTransaction(userCreateArgs);
            trace.setSuccessful();
            this.result.setData(SystemMessages_2.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED, (0, SystemMessagesFunction_1.RESOURCE_RECORD_CREATED_SUCCESSFULLY)(SystemMessages_2.STUDENT_RESOURCE), createdStudentUser);
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async createUserStudentAndGuardianTransaction(args) {
        try {
            const result = await database_1.default.$transaction(async (tx) => {
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
                const user = await this.userCreateProvider.create(args, tx);
                await this.userReadCache.invalidate(args.tenantId);
                const studentArgs = {
                    userId: user.id,
                    classId: args.classId,
                    tenantId: args.tenantId,
                    bloodGroup: args.bloodGroup,
                    dormitoryId: args.dormitoryId,
                    studentGroupIds: args.studentGroupIds,
                    subjectIds: args.subjectIds,
                    classDivisionId: args.classDivisionId,
                    enrollmentDate: args.enrollmentDate || new Date(),
                    guardianIds,
                };
                const student = await this.studentCreateProvider.create(studentArgs, tx);
                await this.studentReadCache.invalidate(args.tenantId);
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
StudentCreateService.serviceName = "StudentCreateService";
StudentCreateService = StudentCreateService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [StudentCreate_provider_1.default,
        UserCreate_provider_1.default,
        StudentRead_cache_1.default,
        UserRead_cache_1.default,
        GuardianCreate_provider_1.default,
        GuardianRead_cache_1.default,
        GuardianUpdate_provider_1.default,
        SubjectRead_provider_1.default])
], StudentCreateService);
exports.default = StudentCreateService;
//# sourceMappingURL=StudentCreate.service.js.map