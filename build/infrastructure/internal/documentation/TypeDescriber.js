"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecuritySchemesDescriber = exports.RefTypeDescriber = exports.TypeDescriber = exports.ResultTDescriber = exports.ResultDescriber = exports.PropFormatEnum = exports.PropTypeEnum = void 0;
const SchemasStore_1 = require("../../internal/documentation/SchemasStore");
const SchemasSecurityStore_1 = require("../../internal/documentation/SchemasSecurityStore");
var PropTypeEnum;
(function (PropTypeEnum) {
    PropTypeEnum["STRING"] = "string";
    PropTypeEnum["NUMBER"] = "number";
    PropTypeEnum["BOOLEAN"] = "boolean";
    PropTypeEnum["OBJECT"] = "object";
    PropTypeEnum["ARRAY"] = "array";
    PropTypeEnum["DATE"] = "date";
    PropTypeEnum["NULL"] = "null";
    PropTypeEnum["UNDEFINED"] = "undefined";
    PropTypeEnum["PRIMITIVE"] = "primitive";
})(PropTypeEnum || (exports.PropTypeEnum = PropTypeEnum = {}));
var PropFormatEnum;
(function (PropFormatEnum) {
    PropFormatEnum["INT_64"] = "int64";
    PropFormatEnum["INT_32"] = "int32";
    PropFormatEnum["FLOAT"] = "float";
    PropFormatEnum["DATE_TIME"] = "date-time";
    PropFormatEnum["DATE"] = "date";
    PropFormatEnum["TIME"] = "time";
    PropFormatEnum["EMAIL"] = "email";
    PropFormatEnum["URI"] = "uri";
    PropFormatEnum["UUID"] = "uuid";
    PropFormatEnum["PASSWORD"] = "password";
    PropFormatEnum["TEXT"] = "text";
})(PropFormatEnum || (exports.PropFormatEnum = PropFormatEnum = {}));
class ResultDescriber {
    constructor(obj) {
        this.name = "Result";
        this.properties = {
            message: {
                type: PropTypeEnum.STRING,
                format: PropFormatEnum.TEXT,
                nullable: false,
                readonly: true,
            },
            error: {
                type: PropTypeEnum.STRING,
                format: PropFormatEnum.TEXT,
                nullable: false,
                readonly: true,
            },
            statusCode: {
                type: PropTypeEnum.STRING,
                format: PropFormatEnum.TEXT,
                nullable: false,
                readonly: true,
            },
            success: {
                type: PropTypeEnum.BOOLEAN,
                format: PropFormatEnum.TEXT,
                nullable: false,
                readonly: true,
            },
        };
        this.type = obj.type;
        if (obj.props?.message)
            this.properties.message = obj.props.message;
        if (obj.props?.error)
            this.properties.error = obj.props.error;
        if (obj.props?.statusCode)
            this.properties.statusCode = obj.props.statusCode;
        if (obj.props?.success)
            this.properties.success = obj.props.success;
        this.schema = {
            name: "Result",
            type: PropTypeEnum.OBJECT,
            properties: {
                message: this.properties.message,
                statusCode: this.properties.statusCode,
                error: this.properties.error,
                success: this.properties.success,
            },
        };
        SchemasStore_1.SchemasStore.add(this.schema.name, {
            type: this.schema.type,
            properties: this.schema.properties,
        });
    }
}
exports.ResultDescriber = ResultDescriber;
class ResultTDescriber {
    constructor(obj) {
        this.properties = {
            message: {
                type: PropTypeEnum.STRING,
                format: PropFormatEnum.TEXT,
                nullable: false,
                readonly: true,
            },
            error: {
                type: PropTypeEnum.STRING,
                format: PropFormatEnum.TEXT,
                nullable: false,
                readonly: true,
            },
            statusCode: {
                type: PropTypeEnum.STRING,
                format: PropFormatEnum.TEXT,
                nullable: false,
                readonly: true,
            },
            success: {
                type: PropTypeEnum.BOOLEAN,
                format: PropFormatEnum.TEXT,
                nullable: false,
                readonly: true,
            },
            data: null,
        };
        this.name = obj.name;
        this.type = obj.type;
        if (obj.props?.message)
            this.properties.message = obj.props.message;
        if (obj.props?.error)
            this.properties.error = obj.props.error;
        if (obj.props?.statusCode)
            this.properties.statusCode = obj.props.statusCode;
        if (obj.props?.success)
            this.properties.success = obj.props.success;
        const reference = "#/components/schemas/" + obj.props.data.schema.name;
        this.schema = {
            name: obj.props.data.type === PropTypeEnum.ARRAY ? `ResultT${this.name}Array` : `ResultT${this.name}`,
            type: PropTypeEnum.OBJECT,
            properties: {
                message: this.properties.message,
                statusCode: this.properties.statusCode,
                error: this.properties.error,
                success: this.properties.success,
                data: obj.props.data.type === PropTypeEnum.ARRAY ? { type: PropTypeEnum.ARRAY, items: { $ref: reference } } : { $ref: reference },
            },
        };
        SchemasStore_1.SchemasStore.add(this.schema.name, {
            type: this.schema.type,
            properties: this.schema.properties,
        });
    }
}
exports.ResultTDescriber = ResultTDescriber;
class TypeDescriber {
    constructor(obj) {
        this.type = obj.type;
        this.properties = obj.props;
        this.schema = {
            name: obj.name,
            type: obj.type,
            required: [],
            properties: {},
        };
        // Handle primitive types
        if (this.type === PropTypeEnum.PRIMITIVE) {
            this.schema.properties = { type: this.properties.primitive };
            return;
        }
        // Process properties
        if (this.type === PropTypeEnum.OBJECT) {
            const schemaType = {};
            Object.keys(this.properties).forEach((key) => {
                const prop = this.properties[key];
                if (prop instanceof TypeDescriber) {
                    // Handle nested TypeDescriber (for objects)
                    schemaType[key] = {
                        type: prop.type,
                        properties: prop.schema.properties, // Reference nested properties
                        nullable: prop.properties?.nullable,
                    };
                }
                else {
                    // Handle other property types
                    if (prop.type === PropTypeEnum.NULL) {
                        schemaType[key] = {
                            type: PropTypeEnum.NULL,
                        };
                    }
                    else if (prop.type === PropTypeEnum.ARRAY) {
                        // Handle array type
                        schemaType[key] = {
                            type: prop.type,
                            items: prop.items, // Directly assign items for arrays
                        };
                    }
                    else {
                        schemaType[key] = {
                            type: prop.type,
                            format: prop.format,
                            nullable: prop.nullable,
                            readonly: prop.readonly,
                        };
                        if (prop.required) {
                            this.schema.required?.push(key);
                        }
                    }
                }
            });
            this.schema.properties = schemaType;
        }
        // Add schema to the store
        SchemasStore_1.SchemasStore.add(this.schema.name, {
            type: this.schema.type,
            properties: this.schema.properties,
            required: this.schema.required,
        });
    }
}
exports.TypeDescriber = TypeDescriber;
class RefTypeDescriber {
    constructor(obj) {
        this.type = obj.type;
        this.schema = {
            name: obj.name,
            definition: {},
        };
        if (this.type === PropTypeEnum.ARRAY) {
            this.schema = {
                name: obj.name,
                definition: {
                    type: PropTypeEnum.ARRAY,
                    items: { $ref: "#/components/schemas/" + obj.name },
                },
            };
        }
        else {
            this.schema = {
                name: obj.name,
                definition: { $ref: "#/components/schemas/" + obj.name },
            };
        }
    }
}
exports.RefTypeDescriber = RefTypeDescriber;
class SecuritySchemesDescriber {
    constructor(key, securitySchemes) {
        this[key] = securitySchemes;
        SchemasSecurityStore_1.SchemasSecurityStore.add(key, securitySchemes);
    }
}
exports.SecuritySchemesDescriber = SecuritySchemesDescriber;
//# sourceMappingURL=TypeDescriber.js.map