import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError";

export class BadRequestError extends ApplicationError {
  constructor(description = "Bad Request Error", httpStatusCode = HttpStatusCodeEnum.BAD_REQUEST) {
    super({
      description,
      httpStatusCode,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
