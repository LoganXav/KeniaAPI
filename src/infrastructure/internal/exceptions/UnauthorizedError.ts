import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import ApplicationError from "./ApplicationError"

export class UnauthorizedError extends ApplicationError {
  constructor(
    description = "You are not authorized to perform this operation"
  ) {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.FORBIDDEN,
      isOperational: undefined
    })
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
