"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const http_1 = require("http");
const AppSettings_1 = __importDefault(require("../../../api/shared/setttings/AppSettings"));
const express_1 = __importDefault(require("../../internal/express"));
class Application {
    constructor() {
        this.express = new express_1.default();
        this.server = (0, http_1.createServer)(this.express.app);
    }
    start(startAt) {
        this.express
            .initializeServices()
            .then(() => {
            this.server.listen(AppSettings_1.default.ServerPort);
        })
            .catch((error) => {
            this.express.loggingProvider.error(`Starting server error: ${error}`);
        });
        this.server.on("listening", () => {
            this.express.apiDocGenerator.saveApiDoc().finish();
            this.express.loggingProvider.info(`${AppSettings_1.default.ServiceName.toUpperCase()} Server running on ${AppSettings_1.default.ServerHost}:${AppSettings_1.default.ServerPort}${AppSettings_1.default.ServerRoot}`);
            const seconds = ((new Date().valueOf() - startAt.valueOf()) / 1000).toFixed(3);
            console.log(`Started Application in ${process.uptime().toFixed(3)} seconds (${AppSettings_1.default.ServiceName.toUpperCase()} running for ${seconds})`);
        });
    }
}
exports.Application = Application;
//# sourceMappingURL=index.js.map