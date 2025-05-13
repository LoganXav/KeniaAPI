import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError";

export class NotFoundError extends ApplicationError {
  constructor(description = "Not found Error") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.NOT_FOUND,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
