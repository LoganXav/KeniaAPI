"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationStatus_enum_1 = __importDefault(require("../../../shared/helpers/enums/ApplicationStatus.enum"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const statusMapping = {
    default: HttpStatusCode_enum_1.HttpStatusCodeEnum.CONTINUE,
    [ApplicationStatus_enum_1.default.SUCCESS]: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
    [ApplicationStatus_enum_1.default.CREATED]: HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED,
};
/*
    You don't need to add mapping for all applicationStatus,
    because if you use the produce property when you are setting the routes in the controller,
    it does the mapping for you according to the applicationStatus and HttpStatus that you will set.
    Here only map the applicationStatus that you will not use the produce property.
  */
statusMapping[ApplicationStatus_enum_1.default.SUCCESS] = HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS;
statusMapping[ApplicationStatus_enum_1.default.CREATED] = HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED;
statusMapping[ApplicationStatus_enum_1.default.NOT_CONTENT] = HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_CONTENT;
statusMapping[ApplicationStatus_enum_1.default.INVALID_INPUT] = HttpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST;
statusMapping[ApplicationStatus_enum_1.default.UNAUTHORIZED] = HttpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED;
statusMapping[ApplicationStatus_enum_1.default.NOT_FOUND] = HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND;
statusMapping[ApplicationStatus_enum_1.default.INTERNAL_ERROR] = HttpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR;
statusMapping[ApplicationStatus_enum_1.default.NOT_IMPLEMENTED] = HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_IMPLEMENTED;
statusMapping[ApplicationStatus_enum_1.default.WORKER_ERROR] = HttpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR;
exports.default = statusMapping;
//# sourceMappingURL=StatusMapping.js.map