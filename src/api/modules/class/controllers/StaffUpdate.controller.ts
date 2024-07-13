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
import UpdateStaffService from "../services/UpdateStaff.service"
  
  @autoInjectable()
  export default class StaffUpdateController extends BaseController {
    static controllerName: string
    private updateStaffService: UpdateStaffService
    constructor(
        updateStaffService: UpdateStaffService
    ) {
      super()
      this.controllerName = "StaffUpdateController"
      this.updateStaffService = updateStaffService
    }
  
    updateOneStaff: EntryPointHandler = async (
      req: IRequest,
      res: IResponse,
      next: INextFunction
    ): Promise<void> => {
      return this.handleResultData(
        res,
        next,
        this.updateStaffService.execute(res.trace, req.body),
        {
          [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON
        }
      )
    }

    updateStaffs: EntryPointHandler = async (
        req: IRequest,
        res: IResponse,
        next: INextFunction
      ): Promise<void> => {
        return this.handleResultData(
          res,
          next,
          this.updateStaffService.updateStaffs(res.trace, req.body),
          {
            [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON
          }
        )
      }

    updateStaffDept: EntryPointHandler = async (
        req: IRequest,
        res: IResponse,
        next: INextFunction
      ): Promise<void> => {
        return this.handleResultData(
          res,
          next,
          this.updateStaffService.updateDept(res.trace, req.body),
          {
            [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON
          }
        )
      }
  
    public initializeRoutes(router: IRouter): void {
      this.setRouter(router())
  
      this.addRoute({
        method: HttpMethodEnum.POST,
        path: "/staff/update_one",
        handlers: [this.updateOneStaff],
        produces: [
          {
            applicationStatus: ApplicationStatusEnum.SUCCESS,
            httpStatus: HttpStatusCodeEnum.SUCCESS
          }
        ],
        description: "Update Staff Information"
      })

      this.addRoute({
        method: HttpMethodEnum.POST,
        path: "/staff/update_many",
        handlers: [this.updateStaffs],
        produces: [
          {
            applicationStatus: ApplicationStatusEnum.SUCCESS,
            httpStatus: HttpStatusCodeEnum.SUCCESS
          }
        ],
        description: "Update Staffs Information"
      })

      this.addRoute({
        method: HttpMethodEnum.POST,
        path: "/staff/update_staff_dept",
        handlers: [this.updateStaffDept],
        produces: [
          {
            applicationStatus: ApplicationStatusEnum.SUCCESS,
            httpStatus: HttpStatusCodeEnum.SUCCESS
          }
        ],
        description: "Update Staff Department"
      })
    }
  }
  