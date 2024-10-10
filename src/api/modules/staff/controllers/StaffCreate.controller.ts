import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import CreateStaffService from "../services/CreateStaff.service";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { createStaffSchema, createStaffUserSchema } from "../validators/StaffCreateSchema";
import { PropTypeEnum, ResultTDescriber, TypeDescriber } from "~/infrastructure/internal/documentation/TypeDescriber";
import { CreateStaffUserData, CreateStaffUserResponse } from "../types/StaffTypes";

@autoInjectable()
export default class StaffCreateController extends BaseController {
  static controllerName: string;
  private createStaffService: CreateStaffService;
  constructor(createStaffService: CreateStaffService) {
    super();
    this.controllerName = "StaffCreateController";
    this.createStaffService = createStaffService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.createStaffService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  createStaffUser: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.createStaffService.createStaffUser(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/create",
      handlers: [validateData(createStaffSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create Staff",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/createstaffuser",
      handlers: [validateData(createStaffUserSchema), this.createStaffUser],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create Staff User",
      apiDoc: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        requireAuth: true,
        schema: new ResultTDescriber<CreateStaffUserResponse>({
          name: "CreateStaffUserResponse",
          type: PropTypeEnum.OBJECT,
          props: {
            data: new TypeDescriber<any>({
              name: "Data",
              type: PropTypeEnum.OBJECT,
              props: {
                user: new TypeDescriber<any>({
                  name: "User",
                  type: PropTypeEnum.OBJECT,
                  props: {
                    id: { type: PropTypeEnum.NUMBER },
                    firstName: { type: PropTypeEnum.STRING },
                    lastName: { type: PropTypeEnum.STRING },
                    email: { type: PropTypeEnum.STRING },
                    password: { type: PropTypeEnum.STRING },
                    phoneNumber: { type: PropTypeEnum.STRING },
                    tenantId: { type: PropTypeEnum.NUMBER },
                  },
                }),
                staff: new TypeDescriber<any>({
                  name: "Staff",
                  type: PropTypeEnum.OBJECT,
                  props: {
                    id: { type: PropTypeEnum.NUMBER },
                    jobTitle: { type: PropTypeEnum.STRING },
                    userId: { type: PropTypeEnum.NUMBER },
                    roleId: { type: PropTypeEnum.NUMBER },
                  },
                }),
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
          description: "CreateStaffUserRequest",
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          schema: new TypeDescriber<CreateStaffUserData>({
            name: "CreateStaffUserRequest",
            type: PropTypeEnum.OBJECT,
            props: {
              firstName: {
                type: PropTypeEnum.STRING,
                required: true,
              },
              lastName: {
                type: PropTypeEnum.STRING,
                required: true,
              },
              phoneNumber: {
                type: PropTypeEnum.STRING,
                required: true,
              },
              email: {
                type: PropTypeEnum.STRING,
                required: true,
              },
              jobTitle: {
                type: PropTypeEnum.STRING,
                required: true,
              },
              tenantId: {
                type: PropTypeEnum.NUMBER,
                required: true,
              },
            },
          }),
        },
      },
    });
  }
}
