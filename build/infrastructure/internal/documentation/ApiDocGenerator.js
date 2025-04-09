"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDocGenerator = void 0;
const AppSettings_1 = __importDefault(require("../../../api/shared/setttings/AppSettings"));
const SchemasStore_1 = require("../../internal/documentation/SchemasStore");
const SchemasSecurityStore_1 = require("../../internal/documentation/SchemasSecurityStore");
const TypeDescriber_1 = require("../../internal/documentation/TypeDescriber");
const HttpStatusDescriber_1 = __importDefault(require("./HttpStatusDescriber"));
const HttpStatusCode_enum_1 = require("../../../api/shared/helpers/enums/HttpStatusCode.enum");
const path_1 = require("path");
const fs_1 = require("fs");
const DEV = "development";
class ApiDocGenerator {
    constructor(env, info) {
        this.env = env;
        this.apiDoc = {
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
        this.apiDoc.info.title = info.title;
        this.apiDoc.info.version = info.version;
        this.apiDoc.info.description = info.description;
        this.apiDoc.info.contact = info.contact;
        this.setSchemas(SchemasStore_1.SchemasStore.get());
        this.setSchemasSecurity(SchemasSecurityStore_1.SchemasSecurityStore.get());
        this.setServer(AppSettings_1.default.getServerUrl(), "Local server");
    }
    saveApiDoc() {
        const wasDocGenerated = !(this.env !== DEV || !Object.keys(this.apiDoc.paths).length);
        if (!wasDocGenerated)
            return this;
        const filePath = (0, path_1.resolve)((0, path_1.join)(__dirname, "../../../../openapi.json"));
        (0, fs_1.writeFileSync)(filePath, JSON.stringify(this.apiDoc, null, 2), "utf8");
        return this;
    }
    setSchemas(schemas) {
        this.apiDoc.components.schemas = schemas;
    }
    setSchemasSecurity(securitySchemes) {
        this.apiDoc.components.securitySchemes = securitySchemes;
    }
    buildParameters(path, parameters) {
        if (!parameters.length)
            return [];
        const parameterNamesInPath = path.match(/(?<=\/:)\w+/g);
        if (parameterNamesInPath?.length) {
            const everyParameterInPathIsInParameters = parameterNamesInPath.every((parameterName) => parameters.find((parameter) => parameter.name === parameterName));
            if (!everyParameterInPathIsInParameters) {
                console.warn(`Path ${path} has parameters in path that are not defined in parameters array.`);
            }
        }
        return parameters;
    }
    buildSchema(schema) {
        const schemaToSet = {
            type: TypeDescriber_1.PropTypeEnum.OBJECT,
            items: { type: TypeDescriber_1.PropTypeEnum.OBJECT, $ref: "" },
            $ref: "",
        };
        if (schema.type === TypeDescriber_1.PropTypeEnum.ARRAY) {
            schemaToSet.items = {
                type: schema.type,
                $ref: `#/components/schemas/${schema.schema.name}`,
            };
            delete schemaToSet.type;
            delete schemaToSet.$ref;
        }
        else if (schema.type === TypeDescriber_1.PropTypeEnum.OBJECT) {
            schemaToSet.$ref = `#/components/schemas/${schema.schema.name}`;
            delete schemaToSet.type;
            delete schemaToSet.items;
        }
        else {
            schemaToSet.type = schema.type;
            delete schemaToSet.items;
            delete schemaToSet.$ref;
        }
        return schemaToSet;
    }
    buildRequestBody(requestBody) {
        return {
            description: requestBody?.description,
            content: {
                [requestBody?.contentType]: {
                    schema: { $ref: `#/components/schemas/${requestBody?.schema.schema.name}` },
                },
            },
        };
    }
    createRouteDoc(route) {
        if (this.env !== DEV)
            return;
        const { path, produces, method, description, apiDoc } = route;
        if (!apiDoc)
            return;
        const { contentType, schema, requestBody, parameters, securitySchemes } = apiDoc;
        if (!this.apiDoc.paths[path]) {
            this.apiDoc.paths[path] = {};
        }
        if (!this.apiDoc.paths[path][method]) {
            this.apiDoc.paths[path][method] = { description: description };
            this.apiDoc.paths[path][method].responses = {};
            if (requestBody)
                this.apiDoc.paths[path][method].requestBody = {};
            if (parameters)
                this.apiDoc.paths[path][method].parameters = [];
        }
        produces.forEach(({ httpStatus }) => {
            const responseSchema = this.getSchemaForStatus(httpStatus, schema);
            const builtSchema = this.buildSchema(responseSchema);
            this.apiDoc.paths[path][method].responses[httpStatus.toString()] = {
                description: HttpStatusDescriber_1.default[httpStatus],
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
    setServer(url, description) {
        this.apiDoc.servers.push({
            url,
            description,
        });
    }
    getSchemaForStatus(applicationStatus, defaultSchema) {
        switch (applicationStatus) {
            case HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS:
            case HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED:
                return defaultSchema; // Success schema
            case HttpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED:
            case HttpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST:
                return {
                    properties: {
                        message: { type: TypeDescriber_1.PropTypeEnum.STRING },
                        error: { type: TypeDescriber_1.PropTypeEnum.STRING },
                        statusCode: { type: TypeDescriber_1.PropTypeEnum.STRING },
                        success: { type: TypeDescriber_1.PropTypeEnum.BOOLEAN },
                        data: { type: TypeDescriber_1.PropTypeEnum.NULL }, // or an appropriate error data schema
                    },
                    name: defaultSchema.schema.name,
                    type: TypeDescriber_1.PropTypeEnum.OBJECT,
                    schema: {
                        name: defaultSchema.schema.name,
                        type: TypeDescriber_1.PropTypeEnum.OBJECT,
                        properties: {
                            message: { type: TypeDescriber_1.PropTypeEnum.STRING },
                            statusCode: { type: TypeDescriber_1.PropTypeEnum.STRING },
                            error: { type: TypeDescriber_1.PropTypeEnum.STRING },
                            success: { type: TypeDescriber_1.PropTypeEnum.BOOLEAN },
                            data: { type: TypeDescriber_1.PropTypeEnum.NULL }, // or an appropriate error data schema
                        },
                    },
                };
            default:
                return defaultSchema; // Default to the provided schema
        }
    }
    finish() {
        SchemasStore_1.SchemasStore.dispose();
        SchemasSecurityStore_1.SchemasSecurityStore.dispose();
    }
}
exports.ApiDocGenerator = ApiDocGenerator;
//# sourceMappingURL=ApiDocGenerator.js.map