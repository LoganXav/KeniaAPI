"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonDriver = void 0;
const winston_1 = __importDefault(require("winston"));
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        success: 3,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "blue",
        success: "green",
    },
};
class WinstonDriver {
    constructor() {
        const customLogFormat = winston_1.default.format.printf(({ timestamp, message, level }) => {
            return `[${level.toUpperCase()}] ${timestamp} ${message}`;
        });
        this.winston = winston_1.default.createLogger({
            levels: customLevels.levels,
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({
                    level: "info",
                    filename: "logs/infoLogs",
                }),
                new winston_1.default.transports.File({
                    level: "success",
                    filename: "logs/accessLogs",
                }),
                new winston_1.default.transports.File({
                    level: "warn",
                    filename: "logs/warningLogs",
                }),
                new winston_1.default.transports.File({
                    level: "error",
                    filename: "logs/errorLogs",
                }),
            ],
            format: winston_1.default.format.combine(winston_1.default.format.json(), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customLogFormat),
        });
        winston_1.default.addColors(customLevels.colors);
    }
    info(data) {
        this.winston.info(data);
    }
    success(data) {
        this.winston.log("success", data);
    }
    warning(data) {
        this.winston.warn(data);
    }
    error(data) {
        this.winston.error(data);
    }
}
exports.WinstonDriver = WinstonDriver;
//# sourceMappingURL=WinstonDriver.js.map