import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/controllers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import ClassCreateService from "~/api/modules/class/services/ClassCreate.service";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { classCreateSchema } from "~/api/modules/class/validators/ClassCreateSchema";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { ClassResponseType, ClassCreateRequestType } from "~/api/modules/class/types/ClassTypes";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import { ResultTDescriber, TypeDescriber, PropTypeEnum } from "~/infrastructure/internal/documentation/TypeDescriber";

@autoInjectable()
export default class ClassCreateController extends BaseController {
  static controllerName: string;
  private classCreateService: ClassCreateService;

  constructor(classCreateService: ClassCreateService) {
    super();
    this.controllerName = "ClassCreateController";
    this.classCreateService = classCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.classCreateService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/class/create",
      handlers: [validateData(classCreateSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create a new class",
      apiDoc: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        requireAuth: false,
        schema: new ResultTDescriber<ClassResponseType>({
          name: "ClassCreateResponse",
          type: PropTypeEnum.OBJECT,
          props: {
            data: new TypeDescriber<ClassResponseType>({
              name: "ClassCreateResponse",
              type: PropTypeEnum.OBJECT,
              props: {
                id: {
                  type: PropTypeEnum.NUMBER,
                },
                name: {
                  type: PropTypeEnum.STRING,
                },
                tenantId: {
                  type: PropTypeEnum.NUMBER,
                },
                students: {
                  type: PropTypeEnum.ARRAY,
                  nullable: true,
                },
                subjects: {
                  type: PropTypeEnum.ARRAY,
                  nullable: true,
                },
                divisions: {
                  type: PropTypeEnum.ARRAY,
                  nullable: true,
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
          description: "ClassCreateRequest",
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          schema: new TypeDescriber<ClassCreateRequestType>({
            name: "ClassCreateRequest",
            type: PropTypeEnum.OBJECT,
            props: {
              name: {
                type: PropTypeEnum.STRING,
                required: false,
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
