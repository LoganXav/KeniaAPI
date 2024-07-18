import "reflect-metadata";
import "dotenv/config";

import { errorHandler } from "./infrastructure/internal/exceptions/ErrorHandler";

import { Application } from "./infrastructure/internal/application";

const app = new Application();

app.start();

process.on("uncaughtException", (error: Error) => {
  console.log(`Uncaught Exception: ${error.message}`);
  errorHandler.handleError(error);
});
