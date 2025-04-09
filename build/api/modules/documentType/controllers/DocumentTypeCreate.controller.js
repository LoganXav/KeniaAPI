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
const Base_controller_1 = __importDefault(require("../../base/contollers/Base.controller"));
const HttpMethod_enum_1 = require("../../../shared/helpers/enums/HttpMethod.enum");
const ApplicationStatus_enum_1 = __importDefault(require("../../../shared/helpers/enums/ApplicationStatus.enum"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const HttpHeader_enum_1 = require("../../../shared/helpers/enums/HttpHeader.enum");
const HttpContentType_enum_1 = require("../../../shared/helpers/enums/HttpContentType.enum");
const tsyringe_1 = require("tsyringe");
const validateData_1 = require("../../../shared/helpers/middleware/validateData");
const DocumentTypeCreateSchema_1 = require("../validators/DocumentTypeCreateSchema");
const DocumentTypeCreate_service_1 = __importDefault(require("../services/DocumentTypeCreate.service"));
let DocumentTypeCreateController = class DocumentTypeCreateController extends Base_controller_1.default {
    constructor(documentTypeCreateService) {
        super();
        this.create = async (req, res, next) => {
            return this.handleResultData(res, next, this.documentTypeCreateService.execute(res.trace, req.body), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.controllerName = "DocumentTypeCreateController";
        this.documentTypeCreateService = documentTypeCreateService;
    }
    initializeRoutes(router) {
        this.setRouter(router());
        this.addRoute({
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            path: "/documenttype/create",
            handlers: [(0, validateData_1.validateData)(DocumentTypeCreateSchema_1.documentTypeCreateSchema), this.create],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED,
                },
            ],
            description: "Create a new document type",
        });
    }
};
DocumentTypeCreateController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [DocumentTypeCreate_service_1.default])
], DocumentTypeCreateController);
exports.default = DocumentTypeCreateController;
//# sourceMappingURL=DocumentTypeCreate.controller.js.map