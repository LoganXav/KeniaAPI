import AppStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"

const statusMapping: Record<string, number> & { default: number } = {
  default: HttpStatusCodeEnum.CONTINUE,
  [AppStatusEnum.SUCCESS]: HttpStatusCodeEnum.SUCCESS,
  [AppStatusEnum.CREATED]: HttpStatusCodeEnum.CREATED
}

/* 
    You don't need to add mapping for all applicationStatus, 
    because if you use the produce property when you are setting the routes in the controller, 
    it does the mapping for you according to the applicationStatus and HttpStatus that you will set.
    Here only map the applicationStatus that you will not use the produce property.
  */
statusMapping[AppStatusEnum.SUCCESS] = HttpStatusCodeEnum.SUCCESS
statusMapping[AppStatusEnum.CREATED] = HttpStatusCodeEnum.CREATED
statusMapping[AppStatusEnum.NOT_CONTENT] = HttpStatusCodeEnum.NOT_CONTENT
statusMapping[AppStatusEnum.INVALID_INPUT] = HttpStatusCodeEnum.BAD_REQUEST
statusMapping[AppStatusEnum.UNAUTHORIZED] = HttpStatusCodeEnum.UNAUTHORIZED
statusMapping[AppStatusEnum.NOT_FOUND] = HttpStatusCodeEnum.NOT_FOUND
statusMapping[AppStatusEnum.INTERNAL_ERROR] =
  HttpStatusCodeEnum.INTERNAL_SERVER_ERROR
statusMapping[AppStatusEnum.NOT_IMPLEMENTED] =
  HttpStatusCodeEnum.NOT_IMPLEMENTED
statusMapping[AppStatusEnum.WORKER_ERROR] =
  HttpStatusCodeEnum.INTERNAL_SERVER_ERROR

export default statusMapping
