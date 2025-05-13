import { EntryPointHandler } from "~/infrastructure/internal/types";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { RefTypeDescriber, ResultDescriber, ResultTDescriber, TypeDescriber } from "~/infrastructure/internal/documentation/TypeDescriber";

export enum ParameterIn {
  QUERY = "query",
  HEADER = "header",
  PATH = "path",
  COOKIE = "cookie",
}

export type ParameterDescriber = {
  name: string;
  in: ParameterIn;
  description: string;
  required: boolean;
  deprecated: boolean;
  allowEmptyValue: boolean;
};

export type SecuritySchemes = {
  type: string;
  scheme: string;
  bearerFormat: string;
};

export type ApiDoc = {
  contentType: HttpContentTypeEnum;
  requireAuth: boolean;
  schema: ResultDescriber | ResultTDescriber<any> | TypeDescriber<any> | RefTypeDescriber;
  requestBody?: {
    contentType: HttpContentTypeEnum;
    description: string;
    schema: TypeDescriber<any> | RefTypeDescriber;
  };
  parameters?: ParameterDescriber[];
  securitySchemes?: Record<string, SecuritySchemes>;
};

export type RouteType = {
  method: HttpMethodEnum;
  path: string;
  handlers: EntryPointHandler[];
  produces: {
    applicationStatus: string;
    httpStatus: HttpStatusCodeEnum;
  }[];
  description?: string;
  apiDoc?: ApiDoc;
  security?: Record<string, any[]>;
};

export interface IApiDocGenerator {
  createRouteDoc(route: Omit<RouteType, "handlers">): void;
}
