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
const TimetableRead_service_1 = __importDefault(require("../services/TimetableRead.service"));
const HttpMethod_enum_1 = require("../../../shared/helpers/enums/HttpMethod.enum");
const HttpHeader_enum_1 = require("../../../shared/helpers/enums/HttpHeader.enum");
const validateData_1 = require("../../../shared/helpers/middleware/validateData");
const TimetableReadSchema_1 = require("../validators/TimetableReadSchema");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const HttpContentType_enum_1 = require("../../../shared/helpers/enums/HttpContentType.enum");
const ApplicationStatus_enum_1 = __importDefault(require("../../../shared/helpers/enums/ApplicationStatus.enum"));
let TimetableReadController = class TimetableReadController extends Base_controller_1.default {
    constructor(timetableReadService) {
        super();
        this.read = async (req, res, next) => {
            return this.handleResultData(res, next, this.timetableReadService.execute(res.trace, req), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.readOne = async (req, res, next) => {
            return this.handleResultData(res, next, this.timetableReadService.readOne(res.trace, req), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.controllerName = "TimetableReadController";
        this.timetableReadService = timetableReadService;
    }
    initializeRoutes(router) {
        this.setRouter(router());
        this.addRoute({
            path: "/timetable/list",
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            handlers: [(0, validateData_1.validateParams)(TimetableReadSchema_1.timetableReadRequestSchema), this.read],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
            ],
            description: "Get timetable info for a class division for the whole term",
        });
        this.addRoute({
            path: "/timetable/info",
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            handlers: [(0, validateData_1.validateParams)(TimetableReadSchema_1.timetableReadOneRequestSchema), this.readOne],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
            ],
            description: "Get timetable info for a class division for a specific day",
        });
    }
};
TimetableReadController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [TimetableRead_service_1.default])
], TimetableReadController);
exports.default = TimetableReadController;
//# sourceMappingURL=TimetableRead.controller.js.map