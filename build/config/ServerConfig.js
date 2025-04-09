"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEV = void 0;
const BooleanUtil_1 = require("../utils/BooleanUtil");
const DefaultValue_1 = require("../utils/DefaultValue");
const Normalize_1 = require("./Normalize");
const ServiceContext_enum_1 = require("../api/shared/helpers/enums/ServiceContext.enum");
exports.DEV = "development";
if (!process.env?.NODE_ENV || BooleanUtil_1.BooleanUtil.areEqual(process.env.NODE_ENV, exports.DEV))
    console.log("Running in dev mode");
const serviceContext = DefaultValue_1.DefaultValue.evaluateAndGet(process.env.SERVICE_CONTEXT, ServiceContext_enum_1.ServiceContext.KENIA_EXPRESS);
exports.default = {
    Environment: DefaultValue_1.DefaultValue.evaluateAndGet(process.env.NODE_ENV, exports.DEV),
    Controllers: {
        ContextPaths: [
            // If you have business logic in multiple contexts -- similar to microservices
            Normalize_1.Normalize.pathFromOS(Normalize_1.Normalize.absolutePath(__dirname, "../api/modules/status/**.controller.??")),
            Normalize_1.Normalize.pathFromOS(Normalize_1.Normalize.absolutePath(__dirname, `../api/modules/${serviceContext}/controllers/**.controller.??`)),
        ],
        DefaultPath: [Normalize_1.Normalize.pathFromOS(Normalize_1.Normalize.absolutePath(__dirname, "../api/modules/**/controllers/**.controller.??"))],
        Ignore: [Normalize_1.Normalize.pathFromOS("**/base")],
    },
    Server: {
        Root: DefaultValue_1.DefaultValue.evaluateAndGet(process.env.SERVER_ROOT, "/api"),
        Host: DefaultValue_1.DefaultValue.evaluateAndGet(process.env.SERVER_HOST, "localhost"),
        Port: DefaultValue_1.DefaultValue.evaluateAndGet(Number(process.env.SERVER_PORT), 5500),
        Origins: DefaultValue_1.DefaultValue.evaluateAndGet(process.env.ORIGINS, "http://localhost:3000,http://localhost:3001,http://localhost:3002"),
        ServiceName: DefaultValue_1.DefaultValue.evaluateAndGet(process.env.SERVICE_NAME, "KENIA"),
        ServiceContext: {
            LoadWithContext: !!process.env.SERVICE_CONTEXT,
            Context: serviceContext,
        },
    },
    Cache: {
        Url: DefaultValue_1.DefaultValue.evaluateAndGet(process.env.CACHE_URL, "redis://kenia_redis:6379"),
    },
    Params: {
        DefaultHealthRemoteService: DefaultValue_1.DefaultValue.evaluateAndGet(process.env.REMOTE_HEALTH_SERVICE, "https://google.com"),
        Security: {
            JWT: {
                SecretKey: process.env.JWT_SECRET_KEY,
                ExpireInSeconds: DefaultValue_1.DefaultValue.evaluateAndGet(parseInt(process.env.JWT_EXPIRATION_TIME, 10), 3600),
            },
            Bcrypt: {
                SaltRounds: parseInt(process.env["BCRYPT_SALT_ROUNDS"], 10),
            },
            Decrypt: {
                Key: process.env.AES_ENCRYPTION_KEY,
                Iv: process.env.AES_ENCRYPTION_IV,
            },
            DefaultPassword: {
                Staff: process.env.DEFAULT_STAFF_PASSWORD,
                Student: process.env.DEFAULT_STUDENT_PASSWORD,
            },
        },
    },
    ApiDocsInfo: {
        title: "Kenia API",
        version: "1.0.0",
        description: "Api documentation for Kenia",
        contact: {
            name: "KeniaAPI",
            url: "https://github.com/Loganxav/KeniaAPI",
            email: "sogbesansegun22@gmail.com",
        },
    },
};
//# sourceMappingURL=ServerConfig.js.map