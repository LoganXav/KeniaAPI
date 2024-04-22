import "reflect-metadata"

import { errorHandler } from "./infrastructure/internal/exceptions/ErrorHandler"
import { container } from "tsyringe"
import { Application } from "./infrastructure/internal/application"

const app = new Application(container)

app.start()

process.on("uncaughtException", (error: Error) => {
  console.log(`Uncaught Exception: ${error.message}`)
  errorHandler.handleError(error)
})
