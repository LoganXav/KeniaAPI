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
var AuthPasswordResetService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const DateTimeUtil_1 = __importDefault(require("../../../../utils/DateTimeUtil"));
const Base_service_1 = require("../../../modules/base/services/Base.service");
const Token_provider_1 = __importDefault(require("../../../modules/auth/providers/Token.provider"));
const UserRead_provider_1 = __importDefault(require("../../../modules/user/providers/UserRead.provider"));
const UserUpdate_provider_1 = __importDefault(require("../../../modules/user/providers/UserUpdate.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const PasswordEncryption_service_1 = require("../../../shared/services/encryption/PasswordEncryption.service");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const UserRead_cache_1 = __importDefault(require("../../user/cache/UserRead.cache"));
let AuthPasswordResetService = AuthPasswordResetService_1 = class AuthPasswordResetService extends Base_service_1.BaseService {
    constructor(tokenProvider, userReadProvider, userUpdateProvider, userReadCache) {
        super(AuthPasswordResetService_1.serviceName);
        this.tokenProvider = tokenProvider;
        this.userReadProvider = userReadProvider;
        this.userUpdateProvider = userUpdateProvider;
        this.userReadCache = userReadCache;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace);
            const { token } = args.params;
            const { password } = args.body;
            const dbResetToken = await this.tokenProvider.getOneByCriteria({ token });
            if (dbResetToken === SystemMessages_1.NULL_OBJECT) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.ERROR_INVALID_TOKEN);
            }
            const foundUser = await this.userReadProvider.getOneByCriteria({ id: dbResetToken.userId });
            if (foundUser === SystemMessages_1.NULL_OBJECT) {
                await this.deactivateUserToken(dbResetToken.id);
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.ERROR_INVALID_TOKEN);
            }
            if (dbResetToken.expired || this.checkTokenExpired(dbResetToken.expiresAt)) {
                await this.deactivateUserToken(dbResetToken.id);
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.ERROR_EXPIRED_TOKEN);
            }
            await this.passwordResetConfirmTransaction(dbResetToken, password);
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, SystemMessages_1.PASSWORD_RESET_SUCCESSFULLY);
            trace.setSuccessful();
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async passwordResetConfirmTransaction(dbResetToken, password) {
        try {
            const result = await database_1.default.$transaction(async (tx) => {
                const updateUserRecordPayload = {
                    userId: dbResetToken.userId,
                    password: PasswordEncryption_service_1.PasswordEncryptionService.hashPassword(password),
                };
                const newUser = await this.userUpdateProvider.updateOneByCriteria(updateUserRecordPayload, tx);
                await this.userReadCache.invalidate(newUser?.tenantId);
                await this.deactivateUserToken(dbResetToken.id, tx);
                return;
            });
            return result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            throw new InternalServerError_1.InternalServerError(SystemMessages_1.SOMETHING_WENT_WRONG);
        }
    }
    async deactivateUserToken(tokenId, tx) {
        const updateUserTokenRecordArgs = {
            tokenId,
            expired: true,
            isActive: false,
        };
        await this.tokenProvider.updateOneByCriteria(updateUserTokenRecordArgs, tx);
    }
    checkTokenExpired(tokenExpiryDate) {
        return DateTimeUtil_1.default.getCurrentDate() > tokenExpiryDate;
    }
};
AuthPasswordResetService.serviceName = "AuthPasswordResetService";
AuthPasswordResetService = AuthPasswordResetService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [Token_provider_1.default, UserRead_provider_1.default, UserUpdate_provider_1.default, UserRead_cache_1.default])
], AuthPasswordResetService);
exports.default = AuthPasswordResetService;
//# sourceMappingURL=AuthPasswordReset.service.js.map