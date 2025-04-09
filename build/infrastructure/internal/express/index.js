"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
require("express-async-errors");
const path_1 = require("path");
const fast_glob_1 = require("fast-glob");
const tsyringe_1 = require("tsyringe");
const TypeParser_1 = require("../../../utils/TypeParser");
const ServerConfig_1 = __importDefault(require("../../../config/ServerConfig"));
const swagger_ui_express_1 = require("swagger-ui-express");
const trace_1 = __importDefault(require("../middleware/trace"));
const ErrorHandler_1 = require("../exceptions/ErrorHandler");
const decryption_1 = __importDefault(require("../middleware/decryption"));
const clientInfo_1 = __importDefault(require("../middleware/clientInfo"));
const AppSettings_1 = __importDefault(require("../../../api/shared/setttings/AppSettings"));
const UnauthorizedError_1 = require("../exceptions/UnauthorizedError");
const jwt_1 = __importDefault(require("../middleware/authorization/jwt"));
const LoggingProviderFactory_1 = require("../logger/LoggingProviderFactory");
const whiteList_1 = __importDefault(require("../middleware/authorization/whiteList"));
const SystemMessages_1 = require("../../../api/shared/helpers/messages/SystemMessages");
const ApiDocGenerator_1 = require("../../internal/documentation/ApiDocGenerator");
const express_1 = __importStar(require("express"));
class Express {
    constructor() {
        this.app = (0, express_1.default)();
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
        this.loadMiddlewares();
        this.apiDocGenerator = new ApiDocGenerator_1.ApiDocGenerator(ServerConfig_1.default.Environment, ServerConfig_1.default.ApiDocsInfo);
        this.loadErrorHandler();
    }
    loadMiddlewares() {
        const options = {
            origin: (origin, callback) => {
                const allowedOrigins = ServerConfig_1.default.Server.Origins.split(",");
                if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                    callback(null, true);
                }
                else {
                    callback(new UnauthorizedError_1.UnauthorizedError("Not allowed by CORS"));
                }
            },
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
            optionsSuccessStatus: 200,
        };
        this.app
            .use((0, cors_1.default)(options))
            .use((0, helmet_1.default)())
            .use(express_1.default.json())
            .use(express_1.default.urlencoded({ extended: true }))
            .use(decryption_1.default.handle)
            .use(clientInfo_1.default.handle)
            .use(whiteList_1.default.handle)
            .use(jwt_1.default.handle)
            .use(trace_1.default.handle);
        this.loggingProvider.info(SystemMessages_1.MIDDLEWARES_ATTACHED);
    }
    async loadControllersDynamically() {
        const controllerPaths = ServerConfig_1.default.Server.ServiceContext.LoadWithContext
            ? ServerConfig_1.default.Controllers.ContextPaths.map((serviceContext) => {
                return (0, fast_glob_1.sync)(serviceContext, {
                    onlyFiles: true,
                    ignore: ServerConfig_1.default.Controllers.Ignore,
                });
            }).flat()
            : (0, fast_glob_1.sync)(ServerConfig_1.default.Controllers.DefaultPath, {
                onlyFiles: true,
                ignore: ServerConfig_1.default.Controllers.Ignore,
            });
        this.loggingProvider.info(`Initializing controllers for ${AppSettings_1.default.ServiceName.toUpperCase()}`);
        for (const filePath of controllerPaths) {
            const controllerPath = (0, path_1.resolve)(filePath);
            const { default: controller } = await Promise.resolve(`${controllerPath}`).then(s => __importStar(require(s)));
            const resolvedController = tsyringe_1.container.resolve(controller);
            resolvedController.setApiDocGenerator(this.apiDocGenerator);
            resolvedController.initializeRoutes(TypeParser_1.TypeParser.cast(express_1.Router));
            this.app.use(AppSettings_1.default.ServerRoot, TypeParser_1.TypeParser.cast(resolvedController.router));
            this.loggingProvider.info(`${resolvedController?.controllerName} was initialized`);
        }
        this.loadApiDocs();
        return Promise.resolve();
    }
    initializeServices() {
        return new Promise((resolve, reject) => {
            this.loadControllersDynamically()
                .then(async () => {
                // Initialize database service and other services here.
                // reject if any error with database or other service.
                return resolve();
            })
                .catch((error) => {
                return reject(error);
            });
        });
    }
    loadApiDocs() {
        this.app.use(`${ServerConfig_1.default.Server.Root}/docs`, swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(this.apiDocGenerator.apiDoc));
        // TODO: Load a not found controller
        // .use(TypeParser.cast<RequestHandler>(statusController.resourceNotFound));
    }
    loadErrorHandler() {
        this.app.use((err, req, res, next) => {
            this.loggingProvider.error(err.message);
            next(err);
        });
        this.app.use((err, req, res, next) => {
            ErrorHandler_1.errorHandler.handleError(err, res);
        });
    }
}
exports.default = Express;
//# sourceMappingURL=index.js.map