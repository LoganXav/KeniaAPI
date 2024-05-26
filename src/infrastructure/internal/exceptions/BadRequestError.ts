import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import ApplicationError from "./ApplicationError"

export class BadRequestError extends ApplicationError {
  constructor(description = "Bad Request Error") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.BAD_REQUEST,
      isOperational: undefined
    })
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
