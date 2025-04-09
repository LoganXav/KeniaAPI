"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const LoggingProviderFactory_1 = require("../logger/LoggingProviderFactory");
const AppSettings_1 = __importDefault(require("../../../api/shared/setttings/AppSettings"));
class RedisClient {
    constructor() { }
    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = (0, redis_1.createClient)({
                url: AppSettings_1.default.getCacheUrl(),
                socket: {
                    connectTimeout: 10000, // Set a reasonable timeout
                },
            });
            // Log Redis connection errors
            RedisClient.instance.on("error", (err) => {
                RedisClient.loggingProvider.error(`Redis Client Error: ${err}`);
            });
            // Connect to Redis and handle any connection issues
            RedisClient.instance.connect().catch((err) => {
                RedisClient.loggingProvider.error(`Redis Connection Error: ${err}`);
            });
            // Optionally handle retry logic if you want to implement automatic retries on failure
            RedisClient.instance.on("end", () => {
                RedisClient.loggingProvider.info("Redis connection ended.");
            });
        }
        return RedisClient.instance;
    }
}
RedisClient.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
exports.default = RedisClient;
//# sourceMappingURL=index.js.map