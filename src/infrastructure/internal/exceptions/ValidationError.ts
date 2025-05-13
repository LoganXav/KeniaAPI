import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError";

export class ValidationError extends ApplicationError {
  constructor(description = "Validation Error") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.UNPROCESSABLE_ENTITY,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
