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
var AuthSignInService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const events_1 = __importDefault(require("../../../shared/helpers/events"));
const Base_service_1 = require("../../../modules/base/services/Base.service");
const EventTypes_enum_1 = require("../../../shared/helpers/enums/EventTypes.enum");
const UserRead_provider_1 = __importDefault(require("../../../modules/user/providers/UserRead.provider"));
const UserUpdate_provider_1 = __importDefault(require("../../../modules/user/providers/UserUpdate.provider"));
const StaffRead_provider_1 = __importDefault(require("../../../modules/staff/providers/StaffRead.provider"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const PasswordEncryption_service_1 = require("../../../shared/services/encryption/PasswordEncryption.service");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const Jwt_service_1 = require("../../../shared/services/jwt/Jwt.service");
const UserRead_cache_1 = __importDefault(require("../../user/cache/UserRead.cache"));
let AuthSignInService = AuthSignInService_1 = class AuthSignInService extends Base_service_1.BaseService {
    constructor(userReadProvider, staffReadProvider, userUpdateProvider, userReadCache) {
        super(AuthSignInService_1.serviceName);
        this.userReadProvider = userReadProvider;
        this.staffReadProvider = staffReadProvider;
        this.userUpdateProvider = userUpdateProvider;
        this.userReadCache = userReadCache;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args, ["password"]);
            const foundUser = await this.userReadProvider.getOneByCriteria({ email: args.email });
            if (foundUser === SystemMessages_1.NULL_OBJECT) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.INVALID_CREDENTIALS);
            }
            const isPasswordMatch = await PasswordEncryption_service_1.PasswordEncryptionService.verifyPassword(args.password, foundUser.password);
            if (args.userType.toUpperCase() !== foundUser.userType) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.INVALID_CREDENTIALS);
            }
            const IS_NOT_MATCH = false;
            if (isPasswordMatch === IS_NOT_MATCH) {
                throw new BadRequestError_1.BadRequestError(SystemMessages_1.INVALID_CREDENTIALS);
            }
            events_1.default.emit(EventTypes_enum_1.eventTypes.user.signIn, { userId: foundUser.id });
            if (foundUser.isFirstTimeLogin) {
                const updateUserRecordArgs = {
                    userId: foundUser.id,
                    isFirstTimeLogin: false,
                };
                const newUser = await this.userUpdateProvider.updateOneByCriteria(updateUserRecordArgs);
                await this.userReadCache.invalidate(newUser?.tenantId);
            }
            const accessToken = await Jwt_service_1.JwtService.getJwt(foundUser);
            const { password, ...signedInUserData } = foundUser;
            this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, SystemMessages_1.SIGN_IN_SUCCESSFUL, signedInUserData, accessToken);
            trace.setSuccessful();
            return this.result;
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setData(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            this.result.setError(SystemMessages_1.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
};
AuthSignInService = AuthSignInService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [UserRead_provider_1.default, StaffRead_provider_1.default, UserUpdate_provider_1.default, UserRead_cache_1.default])
], AuthSignInService);
exports.default = AuthSignInService;
//# sourceMappingURL=AuthSignIn.service.js.map