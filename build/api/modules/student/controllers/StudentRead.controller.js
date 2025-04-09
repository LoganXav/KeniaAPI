"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const StudentRead_service_1 = __importDefault(require("../services/StudentRead.service"));
const Base_controller_1 = __importDefault(require("../../base/contollers/Base.controller"));
const HttpMethod_enum_1 = require("../../../shared/helpers/enums/HttpMethod.enum");
const HttpHeader_enum_1 = require("../../../shared/helpers/enums/HttpHeader.enum");
const validateData_1 = require("../../../shared/helpers/middleware/validateData");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const HttpContentType_enum_1 = require("../../../shared/helpers/enums/HttpContentType.enum");
const ApplicationStatus_enum_1 = __importDefault(require("../../../shared/helpers/enums/ApplicationStatus.enum"));
const StudentReadSchema_1 = require("../validators/StudentReadSchema");
let StudentReadController = class StudentReadController extends Base_controller_1.default {
    constructor(studentReadService) {
        super();
        this.studentReadOne = async (req, res, next) => {
            return this.handleResultData(res, next, this.studentReadService.execute(res.trace, req), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.studentRead = async (req, res, next) => {
            return this.handleResultData(res, next, this.studentReadService.studentRead(res.trace, req), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.controllerName = "StudentReadController";
        this.studentReadService = studentReadService;
    }
    initializeRoutes(router) {
        this.setRouter(router());
        this.addRoute({
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            path: "/student/list",
            handlers: [(0, validateData_1.validateData)(StudentReadSchema_1.studentReadSchema), this.studentRead],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
            ],
            description: "Get Student List",
        });
        this.addRoute({
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            path: "/student/info/:id",
            handlers: [(0, validateData_1.validateData)(StudentReadSchema_1.studentReadOneParamsSchema), this.studentReadOne],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
            ],
            description: "Get Single Student",
        });
    }
};
StudentReadController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [StudentRead_service_1.default])
], StudentReadController);
exports.default = StudentReadController;
//# sourceMappingURL=StudentRead.controller.js.map