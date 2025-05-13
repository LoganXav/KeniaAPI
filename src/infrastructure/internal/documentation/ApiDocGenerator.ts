import { writeFileSync } from "fs";
import { join, resolve } from "path";
import AppSettings from "~/api/shared/setttings/AppSettings";
import { SchemasStore } from "~/infrastructure/internal/documentation/SchemasStore";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import HttpStatusDescriber from "~/infrastructure/internal/documentation/HttpStatusDescriber";
import { SchemasSecurityStore } from "~/infrastructure/internal/documentation/SchemasSecurityStore";
import { PropFormatEnum, PropTypeEnum } from "~/infrastructure/internal/documentation/TypeDescriber";
import { ApiDoc, ParameterDescriber, RouteType, SecuritySchemes } from "~/infrastructure/internal/documentation/IApiDocGenerator";

type SchemaType = { type?: PropTypeEnum } | { $ref?: string } | { type?: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY; items?: { $ref: string } };

type RequestBodyType = {
  description: string;
  content: Record<string, { schema: { $ref: string } }>;
};

type OpenApiType = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact: {
      name: string;
      url: string;
      email: string;
    };
  };
  servers: { url: string; description: string }[];
  paths: Record<
    string,
    Record<
      string,
      {
        description: string;
        responses: Record<
          string,
          {
            description?: string;
            content: Record<
              string,
              {
                schema: SchemaType;
              }
            >;
          }
        >;
        requestBody: RequestBodyType;
        parameters: ParameterDescriber[];
        security: Record<string, any[]>[];
      }
    >
  >;
  components: {
    schemas: Record<string, { type: string; properties: { type: PropTypeEnum; format: PropFormatEnum } }>;
    securitySchemes?: Record<string, SecuritySchemes>;
  };
};

const DEV = "development";

export class ApiDocGenerator {
  apiDoc: OpenApiType = {
    openapi: "3.0.3",
    info: {
      title: "",
      version: "",
      description: "",
      contact: {
        name: "",
        url: "",
        email: "",
      },
    },
    servers: [],
    paths: {},
    components: {
      schemas: {},
    },
  };

  constructor(
    readonly env: string,
    info: {
      title: string;
      version: string;
      description: string;
      contact: {
        name: string;
        url: string;
        email: string;
      };
    }
  ) {
    this.apiDoc.info.title = info.title;
    this.apiDoc.info.version = info.version;
    this.apiDoc.info.description = info.description;
    this.apiDoc.info.contact = info.contact;

    this.setSchemas(SchemasStore.get());
    this.setSchemasSecurity(SchemasSecurityStore.get());

    this.setServer(AppSettings.getServerUrl(), "Local server");
  }

  saveApiDoc(): this {
    const wasDocGenerated = !(this.env !== DEV || !Object.keys(this.apiDoc.paths).length);
    if (!wasDocGenerated) return this;

    const filePath = resolve(join(__dirname, "../../../../openapi.json"));
    writeFileSync(filePath, JSON.stringify(this.apiDoc, null, 2), "utf8");

    return this;
  }

  private setSchemas(schemas: Record<string, any>): void {
    this.apiDoc.components.schemas = schemas;
  }

  private setSchemasSecurity(securitySchemes: Record<string, SecuritySchemes>): void {
    this.apiDoc.components.securitySchemes = securitySchemes;
  }

  private buildParameters(path: string, parameters: ParameterDescriber[]): ParameterDescriber[] | [] {
    if (!parameters.length) return [];

    const parameterNamesInPath = path.match(/(?<=\/:)\w+/g);
    if (parameterNamesInPath?.length) {
      const everyParameterInPathIsInParameters = parameterNamesInPath.every((parameterName) => parameters.find((parameter) => parameter.name === parameterName));
      if (!everyParameterInPathIsInParameters) {
        console.warn(`Path ${path} has parameters in path that are not defined in parameters array.`);
      }
    }

    return parameters;
  }

  private buildSchema(schema: ApiDoc["schema"]): SchemaType {
    const schemaToSet: {
      type?: PropTypeEnum;
      items?: { type: PropTypeEnum.OBJECT | PropTypeEnum.ARRAY; $ref: string };
      $ref?: string;
    } = {
      type: PropTypeEnum.OBJECT,
      items: { type: PropTypeEnum.OBJECT, $ref: "" },
      $ref: "",
    };

    if (schema.type === PropTypeEnum.ARRAY) {
      schemaToSet.items = {
        type: schema.type,
        $ref: `#/components/schemas/${schema.schema.name}`,
      };
      delete schemaToSet.type;
      delete schemaToSet.$ref;
    } else if (schema.type === PropTypeEnum.OBJECT) {
      schemaToSet.$ref = `#/components/schemas/${schema.schema.name}`;
      delete schemaToSet.type;
      delete schemaToSet.items;
    } else {
      schemaToSet.type = schema.type;
      delete schemaToSet.items;
      delete schemaToSet.$ref;
    }

    return schemaToSet;
  }

  private buildRequestBody(requestBody: ApiDoc["requestBody"]): RequestBodyType {
    return {
      description: requestBody?.description as string,
      content: {
        [requestBody?.contentType as HttpContentTypeEnum]: {
          schema: { $ref: `#/components/schemas/${requestBody?.schema.schema.name}` },
        },
      },
    };
  }

  createRouteDoc(route: Omit<RouteType, "handlers">): void {
    if (this.env !== DEV) return;

    const { path, produces, method, description, apiDoc } = route;
    if (!apiDoc) return;

    const { contentType, schema, requestBody, parameters, securitySchemes } = apiDoc;

    if (!this.apiDoc.paths[path]) {
      this.apiDoc.paths[path] = {};
    }

    if (!this.apiDoc.paths[path][method]) {
      this.apiDoc.paths[path][method] = { description: description } as any;
      this.apiDoc.paths[path][method].responses = {};
      if (requestBody) this.apiDoc.paths[path][method].requestBody = {} as any;
      if (parameters) this.apiDoc.paths[path][method].parameters = [];
    }

    produces.forEach(({ httpStatus }) => {
      const responseSchema = this.getSchemaForStatus(httpStatus, schema);
      const builtSchema = this.buildSchema(responseSchema);

      this.apiDoc.paths[path][method].responses[httpStatus.toString()] = {
        description: HttpStatusDescriber[httpStatus],
        content: {
          [contentType]: {
            schema: builtSchema,
          },
        },
      };
      if (requestBody) {
        this.apiDoc.paths[path][method].requestBody = this.buildRequestBody(requestBody);
      }
      if (parameters) {
        this.apiDoc.paths[path][method].parameters = this.buildParameters(path, parameters);
      }
    });

    if (securitySchemes) {
      const securitys = Object.keys(securitySchemes);
      this.apiDoc.paths[path][method].security = securitys.map((key) => ({ [key]: [] }));
    }
  }

  private setServer(url: string, description: "Local server"): void {
    this.apiDoc.servers.push({
      url,
      description,
    });
  }

  private getSchemaForStatus(applicationStatus: HttpStatusCodeEnum, defaultSchema: ApiDoc["schema"]): ApiDoc["schema"] {
    switch (applicationStatus) {
      case HttpStatusCodeEnum.SUCCESS:
      case HttpStatusCodeEnum.CREATED:
        return defaultSchema; // Success schema
      case HttpStatusCodeEnum.UNAUTHORIZED:
      case HttpStatusCodeEnum.BAD_REQUEST:
        return {
          properties: {
            message: { type: PropTypeEnum.STRING },
            error: { type: PropTypeEnum.STRING },
            statusCode: { type: PropTypeEnum.STRING },
            success: { type: PropTypeEnum.BOOLEAN },
            data: { type: PropTypeEnum.NULL }, // or an appropriate error data schema
          },
          name: defaultSchema.schema.name,
          type: PropTypeEnum.OBJECT,
          schema: {
            name: defaultSchema.schema.name,
            type: PropTypeEnum.OBJECT,
            properties: {
              message: { type: PropTypeEnum.STRING },
              statusCode: { type: PropTypeEnum.STRING },
              error: { type: PropTypeEnum.STRING },
              success: { type: PropTypeEnum.BOOLEAN },
              data: { type: PropTypeEnum.NULL }, // or an appropriate error data schema
            },
          },
        };
      default:
        return defaultSchema; // Default to the provided schema
    }
  }

  finish(): void {
    SchemasStore.dispose();
    SchemasSecurityStore.dispose();
  }
}
