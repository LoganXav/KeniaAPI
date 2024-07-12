import {
    EntryPointHandler,
    INextFunction,
    IRequest,
    IResponse,
    IRouter
  } from "~/infrastructure/internal/types"
  import BaseController from "../../base/contollers/Base.controller"
  import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum"
  import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum"
  import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
  import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum"
  import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum"
  import { autoInjectable } from "tsyringe"
import ReadStaffService from "../services/ReadStaff.service"
  
  @autoInjectable()
  export default class StaffUpdateController extends BaseController {
    static controllerName: string
    private readStaffService: ReadStaffService
    constructor(
        readStaffService: ReadStaffService
    ) {
      super()
      this.controllerName = "StaffReadController"
      this.readStaffService = readStaffService
    }
  
    getOneStaff: EntryPointHandler = async (
      req: IRequest,
      res: IResponse,
      next: INextFunction
    ): Promise<void> => {
      return this.handleResultData(
        res,
        next,
        this.readStaffService.execute(res.trace, req.body),
        {
          [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON
        }
      )
    }

    getStaffs: EntryPointHandler = async (
        req: IRequest,
        res: IResponse,
        next: INextFunction
      ): Promise<void> => {
        return this.handleResultData(
          res,
          next,
          this.readStaffService.getStaffs(res.trace, req.body),
          {
            [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON
          }
        )
      }
  
    public initializeRoutes(router: IRouter): void {
      this.setRouter(router())
  
      this.addRoute({
        method: HttpMethodEnum.POST,
        path: "/staff",
        handlers: [this.getOneStaff],
        produces: [
          {
            applicationStatus: ApplicationStatusEnum.SUCCESS,
            httpStatus: HttpStatusCodeEnum.SUCCESS
          }
        ],
        description: "Get Staff Information"
      })

      this.addRoute({
        method: HttpMethodEnum.POST,
        path: "/staff/all",
        handlers: [this.getStaffs],
        produces: [
          {
            applicationStatus: ApplicationStatusEnum.SUCCESS,
            httpStatus: HttpStatusCodeEnum.SUCCESS
          }
        ],
        description: "Get Staffs Information"
      })
    }
  }
  