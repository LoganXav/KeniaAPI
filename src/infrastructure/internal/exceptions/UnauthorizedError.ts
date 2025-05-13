import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError";

export class UnauthorizedError extends ApplicationError {
  constructor(description = "You are not authorized to perform this operation") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.FORBIDDEN,
      isOperational: true,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
