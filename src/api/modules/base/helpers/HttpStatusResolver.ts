import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { DefaultValue } from "~/utils/DefaultValue"
import statusMapping from "./StatusMapping"

export class HttpStatusResolver {
  static getCode(applicationStatusCode: string): HttpStatusCodeEnum {
    return DefaultValue.evaluateAndGet(
      statusMapping[applicationStatusCode],
      statusMapping.default
    )
  }
}
