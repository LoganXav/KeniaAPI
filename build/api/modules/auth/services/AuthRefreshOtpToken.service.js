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
var AuthRefreshOtpTokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
const Token_provider_1 = __importDefault(require("../providers/Token.provider"));
const BusinessConfig_1 = require("../../../../config/BusinessConfig");
const Base_service_1 = require("../../base/services/Base.service");
const GenerateStringOfLength_1 = require("../../../../utils/GenerateStringOfLength");
const Email_service_1 = require("../../../shared/services/email/Email.service");
const UserRead_provider_1 = __importDefault(require("../../../modules/user/providers/UserRead.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessagesFunction_1 = require("../../../shared/helpers/messages/SystemMessagesFunction");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
let AuthRefreshOtpTokenService = AuthRefreshOtpTokenService_1 = class AuthRefreshOtpTokenService extends Base_service_1.BaseService {
    constructor(tokenProvider, userReadProvider) {
        super(AuthRefreshOtpTokenService_1.serviceName);
        this.tokenProvider = tokenProvider;
        this.userReadProvider = userReadProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args);
            const foundUser = await this.userReadProvider.getOneByCriteria({ email: args.email });
            if (foundUser === SystemMessages_1.NULL_OBJECT) {
                throw new BadRequestError_1.BadRequestError((0, SystemMessagesFunction_1.RESOURCE_RECORD_NOT_FOUND)(SystemMessages_1.USER_RESOURCE));
            }
            if (foundUser.hasVerified) {
                this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.ACCEPTED, SystemMessages_1.ACCOUNT_VERIFIED);
                trace.setSuccessful();
                return this.result;
            }
            const otpToken = await this.authRefreshTokenTransaction(foundUser);
            await Email_service_1.EmailService.sendAccountActivationEmail({
                userEmail: foundUser.email,
                activationToken: otpToken,
            });
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED, SystemMessages_1.TOKEN_REFRESH_SUCCESS, SystemMessages_1.NULL_OBJECT);
            trace.setSuccessful();
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async authRefreshTokenTransaction(foundUser) {
        try {
            const result = await database_1.default.$transaction(async (tx) => {
                const userTokens = await this.tokenProvider.getByCriteria({
                    userId: foundUser.id,
                    tokenType: client_1.TokenType.EMAIL,
                }, tx);
                if (userTokens) {
                    for (const token of userTokens) {
                        await this.deactivateUserToken(token.id, tx);
                    }
                }
                const otpToken = (0, GenerateStringOfLength_1.generateStringOfLength)(BusinessConfig_1.businessConfig.emailTokenLength);
                const expiresAt = luxon_1.DateTime.now().plus({ minutes: BusinessConfig_1.businessConfig.emailTokenExpiresInMinutes }).toJSDate();
                await this.tokenProvider.create({
                    userId: foundUser.id,
                    tokenType: client_1.TokenType.EMAIL,
                    expiresAt,
                    token: otpToken,
                }, tx);
                return otpToken;
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
};
AuthRefreshOtpTokenService.serviceName = "AuthRefreshOtpTokenService";
AuthRefreshOtpTokenService = AuthRefreshOtpTokenService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [Token_provider_1.default, UserRead_provider_1.default])
], AuthRefreshOtpTokenService);
exports.default = AuthRefreshOtpTokenService;
//# sourceMappingURL=AuthRefreshOtpToken.service.js.map