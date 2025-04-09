"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const application_1 = require("./infrastructure/internal/application");
const ErrorHandler_1 = require("./infrastructure/internal/exceptions/ErrorHandler");
const app = new application_1.Application();
app.start(new Date());
process.on("uncaughtException", (error) => {
    console.log(`Uncaught Exception: ${error.message}`);
    ErrorHandler_1.errorHandler.handleError(error);
});
//# sourceMappingURL=index.js.map