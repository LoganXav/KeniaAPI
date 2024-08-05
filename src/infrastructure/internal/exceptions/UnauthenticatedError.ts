import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationError from "./ApplicationError";

export class UnauthenticatedError extends ApplicationError {
  constructor(description = "Not Authenticated") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.UNAUTHORIZED,
      isOperational: undefined,
    });

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
