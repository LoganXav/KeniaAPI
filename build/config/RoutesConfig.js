"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE_WHITE_LIST = void 0;
const ServerConfig_1 = __importDefault(require("./ServerConfig"));
const root = ServerConfig_1.default.Server.Root;
// Add all the white listed routes in the application
exports.ROUTE_WHITE_LIST = [
    `${root}/ping`,
    // Additional routes for Swagger UI assets
    `${root}/docs/`,
    `${root}/docs/swagger.json`, // Swagger JSON spec
    `${root}/docs/swagger.json`, // Swagger spec file path
    // Swagger UI Assets
    `${root}/docs/swagger-ui.css`,
    `${root}/docs/favicon-32x32.png`,
    `${root}/docs/swagger-ui-init.js`,
    `${root}/docs/swagger-ui-bundle.js`,
    `${root}/docs/CircularXXWeb-Book.woff2`,
    `${root}/docs/swagger-ui-standalone-preset.js`,
    // Auth routes
    `${root}/auth/signin`,
    `${root}/auth/signup`,
    `${root}/auth/otp/refresh`,
    `${root}/auth/otp/verify`,
    `${root}/auth/password-reset/request`,
    `${root}/auth/password-reset/:token`,
];
//# sourceMappingURL=RoutesConfig.js.map