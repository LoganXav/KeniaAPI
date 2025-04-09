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
var AuthVerifyOtpTokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const DateTimeUtil_1 = __importDefault(require("../../../../utils/DateTimeUtil"));
const client_1 = require("@prisma/client");
const Token_provider_1 = __importDefault(require("../providers/Token.provider"));
const Jwt_service_1 = require("../../../shared/services/jwt/Jwt.service");
const Base_service_1 = require("../../../modules/base/services/Base.service");
const UserRead_provider_1 = __importDefault(require("../../../modules/user/providers/UserRead.provider"));
const UserUpdate_provider_1 = __importDefault(require("../../../modules/user/providers/UserUpdate.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const UserRead_cache_1 = __importDefault(require("../../user/cache/UserRead.cache"));
let AuthVerifyOtpTokenService = AuthVerifyOtpTokenService_1 = class AuthVerifyOtpTokenService extends Base_service_1.BaseService {
    constructor(tokenProvider, userReadProvider, userUpdateProvider, userReadCache) {
        super(AuthVerifyOtpTokenService_1.serviceName);
        this.tokenProvider = tokenProvider;
        this.userReadProvider = userReadProvider;
        this.userUpdateProvider = userUpdateProvider;
        this.userReadCache = userReadCache;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            const { id: userId, otpToken } = args;
            this.initializeServiceTrace(trace, args, ["otpToken"]);
            if (!otpToken) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.ERROR_INVALID_TOKEN);
            }
            const dbOtpToken = await this.tokenProvider.getOneByCriteria({ token: otpToken });
            if (dbOtpToken === SystemMessages_1.NULL_OBJECT) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.ERROR_INVALID_TOKEN);
            }
            if (dbOtpToken.tokenType != client_1.TokenType.EMAIL) {
                await this.deactivateUserToken(dbOtpToken.id);
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.ERROR_INVALID_TOKEN);
            }
            const tokenOwner = await this.userReadProvider.getOneByCriteria({ id: dbOtpToken.userId });
            if (tokenOwner === SystemMessages_1.NULL_OBJECT) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.ERROR_INVALID_TOKEN);
            }
            if (tokenOwner.id !== userId) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.ERROR_INVALID_TOKEN);
            }
            const accessToken = await Jwt_service_1.JwtService.getJwt(tokenOwner);
            const { password, ...verifyUserData } = tokenOwner;
            if (tokenOwner.hasVerified) {
                this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.ACCEPTED, SystemMessages_1.ACCOUNT_VERIFIED, verifyUserData, accessToken);
                trace.setSuccessful();
                return this.result;
            }
            if (dbOtpToken.expired || this.checkTokenExpired(dbOtpToken.expiresAt)) {
                await this.deactivateUserToken(dbOtpToken.id);
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.TOKEN_EXPIRED);
            }
            await this.verifyUserAccountTransaction(dbOtpToken, userId);
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, SystemMessages_1.TOKEN_VERIFIED, verifyUserData, accessToken);
            trace.setSuccessful();
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async verifyUserAccountTransaction(dbOtpToken, userId) {
        try {
            const result = await database_1.default.$transaction(async (tx) => {
                await this.verifyUserAccount(userId, tx);
                await this.deactivateUserToken(dbOtpToken.id, tx);
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
    async verifyUserAccount(userId, tx) {
        const verifyUserAccountArgs = {
            userId,
            hasVerified: true,
        };
        const newUser = await this.userUpdateProvider.updateOneByCriteria(verifyUserAccountArgs, tx);
        await this.userReadCache.invalidate(newUser?.tenantId);
    }
    checkTokenExpired(tokenExpiryDate) {
        return DateTimeUtil_1.default.getCurrentDate() > tokenExpiryDate;
    }
};
AuthVerifyOtpTokenService.serviceName = "AuthVerifyOtpTokenService";
AuthVerifyOtpTokenService = AuthVerifyOtpTokenService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [Token_provider_1.default, UserRead_provider_1.default, UserUpdate_provider_1.default, UserRead_cache_1.default])
], AuthVerifyOtpTokenService);
exports.default = AuthVerifyOtpTokenService;
//# sourceMappingURL=AuthVerifyOtpToken.service.js.map