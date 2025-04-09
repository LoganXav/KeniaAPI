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
const Base_controller_1 = __importDefault(require("../../base/contollers/Base.controller"));
const SchoolCalendarRead_service_1 = __importDefault(require("../services/SchoolCalendarRead.service"));
const HttpMethod_enum_1 = require("../../../shared/helpers/enums/HttpMethod.enum");
const HttpHeader_enum_1 = require("../../../shared/helpers/enums/HttpHeader.enum");
const validateData_1 = require("../../../shared/helpers/middleware/validateData");
const SchoolCalendarReadSchema_1 = require("../validators/SchoolCalendarReadSchema");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const HttpContentType_enum_1 = require("../../../shared/helpers/enums/HttpContentType.enum");
const ApplicationStatus_enum_1 = __importDefault(require("../../../shared/helpers/enums/ApplicationStatus.enum"));
let SchoolCalendarReadController = class SchoolCalendarReadController extends Base_controller_1.default {
    constructor(schoolCalendarReadService) {
        super();
        this.read = async (req, res, next) => {
            return this.handleResultData(res, next, this.schoolCalendarReadService.execute(res.trace, req.body), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.readOne = async (req, res, next) => {
            return this.handleResultData(res, next, this.schoolCalendarReadService.readOne(res.trace, req.body), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.controllerName = "SchoolCalendarReadController";
        this.schoolCalendarReadService = schoolCalendarReadService;
    }
    initializeRoutes(router) {
        this.setRouter(router());
        this.addRoute({
            path: "/calendar/list",
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            handlers: [(0, validateData_1.validateData)(SchoolCalendarReadSchema_1.schoolCalendarReadSchema), this.read],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
            ],
            description: "Get all school calendars",
        });
        this.addRoute({
            path: "/calendar/info",
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            handlers: [(0, validateData_1.validateData)(SchoolCalendarReadSchema_1.schoolCalendarReadSchema), this.readOne],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
            ],
            description: "Get a Single School Calendar",
        });
    }
};
SchoolCalendarReadController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [SchoolCalendarRead_service_1.default])
], SchoolCalendarReadController);
exports.default = SchoolCalendarReadController;
//# sourceMappingURL=SchoolCalendarRead.controller.js.map