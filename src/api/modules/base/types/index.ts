import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { EntryPointHandler } from "~/infrastructure/internal/types"

export type RouteType = {
  method: HttpMethodEnum
  path: string
  handlers: EntryPointHandler[]
  produces: {
    applicationStatus: string
    httpStatus: HttpStatusCodeEnum
  }[]
  description?: string
  //   TODO - Add Api Doc Type
}
