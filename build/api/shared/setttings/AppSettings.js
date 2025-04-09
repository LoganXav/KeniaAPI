"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConstants = void 0;
const ServerConfig_1 = __importDefault(require("../../../config/ServerConfig"));
class AppSettings {
    constructor(serverConfig) {
        this.ServerPort = serverConfig.Server.Port;
        this.ServerHost = serverConfig.Server.Host;
        this.ServerRoot = serverConfig.Server.Root;
        this.CacheUrl = serverConfig.Cache.Url;
        this.ServiceName = serverConfig.Server.ServiceName;
        this.ServiceContext = serverConfig.Server.ServiceContext.Context;
        this.DefaultHealthRemoteService = serverConfig.Params.DefaultHealthRemoteService.Context;
        this.JWTEncryptionKey = serverConfig.Params.Security.JWT.SecretKey;
        this.JWTExpirationTime = serverConfig.Params.Security.JWT.ExpireInSeconds;
    }
    getServerUrl() {
        return `http://${this.ServerHost}:${this.ServerPort}${this.ServerRoot}`;
    }
    getCacheUrl() {
        return this.CacheUrl;
    }
}
exports.default = new AppSettings(ServerConfig_1.default);
class AppConstants {
}
exports.AppConstants = AppConstants;
AppConstants.SHA512_ALGORITHM = "sha512";
AppConstants.SHA256_ALGORITHM = "sha256";
AppConstants.HS512_ALGORITHM = "HS512";
AppConstants.BASE64_ENCODING = "base64";
AppConstants.ASCII_ENCODING = "ascii";
//# sourceMappingURL=AppSettings.js.map