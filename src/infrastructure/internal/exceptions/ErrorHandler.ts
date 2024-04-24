import {
  CRITICAL_ERROR_EXITING,
  ERROR,
} from "~/api/shared/helpers/messages/SystemMessages"
import ApplicationError from "./ApplicationError"
import { Response } from "express"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"

// https://www.codeconcisely.com/posts/how-to-handle-errors-in-express-with-typescript/
class ErrorHandler {
  public handleError(
    error: Error | ApplicationError,
    response?: Response
  ): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as ApplicationError, response)
    } else {
      this.handleCriticalError(error, response)
    }
  }

  private isTrustedError(error: Error) {
    if (error instanceof ApplicationError) {
      return !!error.isOperational
    }
  }

  private handleTrustedError(
    error: ApplicationError,
    response: Response
  ): void {
    response.status(error.httpCode).json({
      status_code: error.httpCode,
      status: ERROR,
      message: error.message,
    })
  }
  private handleCriticalError(
    error: Error | ApplicationError,
    response?: Response
  ): void {
    if (response) {
      response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: error.message,
      })
    }
    console.log(error)
    console.log(CRITICAL_ERROR_EXITING)
    process.exit(1)
  }
}
export const errorHandler = new ErrorHandler()
