import "reflect-metadata";
import "dotenv/config";
import { Application } from "./infrastructure/internal/application";
import { errorHandler } from "./infrastructure/internal/exceptions/ErrorHandler";

const app = new Application();

app.start();

process.on("uncaughtException", (error: Error) => {
  console.log(`Uncaught Exception: ${error.message}`);
  errorHandler.handleError(error);
});
