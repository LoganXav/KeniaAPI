import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import UpdateStaffService from "../services/UpdateStaff.service";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { getAndUpdateStaffSchema } from "../validators/StaffCreateSchema";
import { PropTypeEnum, ResultTDescriber, TypeDescriber } from "~/infrastructure/internal/documentation/TypeDescriber";
import { GetAndUpdateStaffV, UpdateStaffResponse } from "../types/StaffTypes";

@autoInjectable()
export default class StaffUpdateController extends BaseController {
  static controllerName: string;
  private updateStaffService: UpdateStaffService;
  constructor(updateStaffService: UpdateStaffService) {
    super();
    this.controllerName = "StaffUpdateController";
    this.updateStaffService = updateStaffService;
  }

  updateOneStaff: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.updateStaffService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  updateStaffs: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.updateStaffService.updateStaffs(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  removeListFromStaff: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.updateStaffService.removeListFromStaff(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/update_one",
      handlers: [validateData(getAndUpdateStaffSchema), this.updateOneStaff],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update Staff Information",
      apiDoc: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        requireAuth: true,
        schema: new ResultTDescriber<UpdateStaffResponse>({
          name: "CreateStaffResponse",
          type: PropTypeEnum.OBJECT,
          props: {
            data: new TypeDescriber<UpdateStaffResponse>({
              name: "CreateStaffResponse",
              type: PropTypeEnum.OBJECT,
              props: {
                id: {
                  type: PropTypeEnum.NUMBER,
                },
                jobTitle: {
                  type: PropTypeEnum.STRING,
                },
                userId: {
                  type: PropTypeEnum.NUMBER,
                },
                roleId: {
                  type: PropTypeEnum.NUMBER,
                },
              },
            }),
            error: {
              type: PropTypeEnum.STRING,
            },
            message: {
              type: PropTypeEnum.STRING,
            },
            statusCode: {
              type: PropTypeEnum.STRING,
            },
            success: {
              type: PropTypeEnum.BOOLEAN,
            },
          },
        }),
        requestBody: {
          description: "UpdateStaffRequest",
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          schema: new TypeDescriber<GetAndUpdateStaffV>({
            name: "UpdateStaffRequest",
            type: PropTypeEnum.OBJECT,
            props: {
              criteria: {
                type: PropTypeEnum.OBJECT,
                required: true,
              },
              data: {
                type: PropTypeEnum.OBJECT,
                required: true,
              },
            },
          }),
        },
      },
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/update_many",
      handlers: [this.updateStaffs],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update Staffs Information",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/remove_list",
      handlers: [this.removeListFromStaff],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update Staff Department",
    });
  }
}
