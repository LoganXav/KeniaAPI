import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { staffCreateRequestSchema } from "../validators/StaffCreateSchema";
import { PropTypeEnum, ResultTDescriber, TypeDescriber } from "~/infrastructure/internal/documentation/TypeDescriber";
import { StaffCreateRequestType, StaffCreateResponseType } from "../types/StaffTypes";
import StaffCreateService from "../services/StaffCreate.service";

@autoInjectable()
export default class StaffCreateController extends BaseController {
  static controllerName: string;
  private staffCreateService: StaffCreateService;
  constructor(StaffCreateService: StaffCreateService) {
    super();
    this.controllerName = "StaffCreateController";
    this.staffCreateService = StaffCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.staffCreateService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/create",
      handlers: [validateData(staffCreateRequestSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create Staff",
      apiDoc: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        requireAuth: true,
        schema: new ResultTDescriber<StaffCreateResponseType>({
          name: "StaffCreateResponse",
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
          description: "StaffCreateRequest",
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          schema: new TypeDescriber<StaffCreateRequestType>({
            name: "StaffCreateRequest",
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
                required: false, // Made optional to align with schema
              },
              email: {
                type: PropTypeEnum.STRING,
                required: true,
              },
              jobTitle: {
                type: PropTypeEnum.STRING,
                required: true,
              },
              address: {
                type: PropTypeEnum.STRING,
                required: false,
              },
              stateId: {
                type: PropTypeEnum.NUMBER,
                required: false,
              },
              lgaId: {
                type: PropTypeEnum.NUMBER,
                required: false,
              },
              countryId: {
                type: PropTypeEnum.NUMBER,
                required: false,
              },
              zipCode: {
                type: PropTypeEnum.NUMBER,
                required: false,
              },
              postalCode: {
                type: PropTypeEnum.STRING,
                required: false,
              },
              employmentType: {
                type: PropTypeEnum.STRING,
                required: false,
              },
              startDate: {
                type: PropTypeEnum.STRING,
                required: false,
              },
              nin: {
                type: PropTypeEnum.STRING,
                required: false,
              },
              tin: {
                type: PropTypeEnum.STRING,
                required: false,
              },
              highestLevelEdu: {
                type: PropTypeEnum.STRING,
                required: false,
              },
              cvUrl: {
                type: PropTypeEnum.STRING,
                required: false,
              },
              roleId: {
                type: PropTypeEnum.NUMBER,
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
