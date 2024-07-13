import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller"
import SignUpService from "../services/SignUp.service";
import HelloService from "../services/SignUp.service";
import { EntryPointHandler, INextFunction, IRequest, IResponse } from "~/infrastructure/internal/types";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { IRouter } from "express";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";

@autoInjectable()
export default class SimpleRegister extends BaseController {
    static controllerName: string
    helloService: HelloService
    constructor(helloService: HelloService){
        super()
        this.controllerName = 'RegisterController'
        this.helloService = helloService
    }

    hello: EntryPointHandler = async (
        req: IRequest,
        res: IResponse,
        next: INextFunction
    ): Promise<void> => {
        return this.handleResult(res, next, this.helloService.execute(res.trace), {
            [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.TEXT_PLAIN
        })
    }

    public initializeRoutes(router: IRouter): void {
        this.setRouter(router())
        this.addRoute({
            method: HttpMethodEnum.GET,
            path: "/hello",
            handlers: [this.hello],
            produces: [
                {
                    applicationStatus: ApplicationStatusEnum.SUCCESS,
                    httpStatus: HttpStatusCodeEnum.SUCCESS
                }
            ],
            description: "hello endpoint"
        })
    }
}
