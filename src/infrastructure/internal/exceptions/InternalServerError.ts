import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError";

export class InternalServerError extends ApplicationError {
  constructor(description = "Internal Server Error") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
