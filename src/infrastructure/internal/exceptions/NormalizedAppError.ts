import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { SOMETHING_WENT_WRONG } from "~/api/shared/helpers/messages/SystemMessages";
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { ValidationError } from "~/infrastructure/internal/exceptions/ValidationError";
import { UnauthorizedError } from "~/infrastructure/internal/exceptions/UnauthorizedError";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { UnauthenticatedError } from "~/infrastructure/internal/exceptions/UnauthenticatedError";

export class NormalizedAppError extends ApplicationError {
  constructor(error: unknown) {
    const resolved = NormalizedAppError.resolve(error);
    super({
      description: resolved.description,
      httpStatusCode: resolved.httpStatusCode,
      isOperational: resolved.isOperational,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }

  private static knownErrors = [BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError, ValidationError];

  private static resolve(error: unknown): ApplicationError {
    for (const KnownError of this.knownErrors) {
      if (error instanceof KnownError) {
        return error;
      }
    }

    return new InternalServerError(SOMETHING_WENT_WRONG);
  }
}
