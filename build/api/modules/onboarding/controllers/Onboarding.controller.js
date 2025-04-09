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
const validateData_1 = require("../../../shared/helpers/middleware/validateData");
const ApplicationStatus_enum_1 = __importDefault(require("../../../shared/helpers/enums/ApplicationStatus.enum"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const OnboardingSchema_1 = require("../validators/OnboardingSchema");
const HttpHeader_enum_1 = require("../../../shared/helpers/enums/HttpHeader.enum");
const HttpContentType_enum_1 = require("../../../shared/helpers/enums/HttpContentType.enum");
const tsyringe_1 = require("tsyringe");
const Onboarding_service_1 = __importDefault(require("../services/Onboarding.service"));
let OnboardingController = class OnboardingController extends Base_controller_1.default {
    constructor(onboardingService) {
        super();
        this.personalInformation = async (req, res, next) => {
            return this.handleResultData(res, next, this.onboardingService.execute(res.trace, req), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.residentialInformation = async (req, res, next) => {
            return this.handleResultData(res, next, this.onboardingService.residentialInformation(res.trace, req), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.schoolInformation = async (req, res, next) => {
            return this.handleResultData(res, next, this.onboardingService.schoolInformation(res.trace, req), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.controllerName = "OnboardingProcessController";
        this.onboardingService = onboardingService;
    }
    initializeRoutes(router) {
        this.setRouter(router());
        this.addRoute({
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            path: "/onboarding/personal",
            handlers: [(0, validateData_1.validateData)(OnboardingSchema_1.onboardingPersonalSchema), this.personalInformation],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
            ],
            description: "Onboarding Personal Information",
        });
        this.addRoute({
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            path: "/onboarding/residential",
            handlers: [(0, validateData_1.validateData)(OnboardingSchema_1.onboardingResidentialSchema), this.residentialInformation],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
            ],
            description: "Onboarding Residential Information",
        });
        this.addRoute({
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            path: "/onboarding/school",
            handlers: [(0, validateData_1.validateData)(OnboardingSchema_1.onboardingSchoolSchema), this.schoolInformation],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
            ],
            description: "Onboarding School Information",
        });
    }
};
OnboardingController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [Onboarding_service_1.default])
], OnboardingController);
exports.default = OnboardingController;
//# sourceMappingURL=Onboarding.controller.js.map