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
const VerifyOtpSchema_1 = require("../validators/VerifyOtpSchema");
const HttpHeader_enum_1 = require("../../../shared/helpers/enums/HttpHeader.enum");
const HttpMethod_enum_1 = require("../../../shared/helpers/enums/HttpMethod.enum");
const RefreshOtpTokenSchema_1 = require("../validators/RefreshOtpTokenSchema");
const validateData_1 = require("../../../shared/helpers/middleware/validateData");
const AuthVerifyOtpToken_service_1 = __importDefault(require("../services/AuthVerifyOtpToken.service"));
const AuthRefreshOtpToken_service_1 = __importDefault(require("../services/AuthRefreshOtpToken.service"));
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const ApplicationStatus_enum_1 = __importDefault(require("../../../shared/helpers/enums/ApplicationStatus.enum"));
const HttpContentType_enum_1 = require("../../../shared/helpers/enums/HttpContentType.enum");
const TypeDescriber_1 = require("../../../../infrastructure/internal/documentation/TypeDescriber");
let AuthOtpTokenController = class AuthOtpTokenController extends Base_controller_1.default {
    constructor(authRefreshOtpTokenService, authVerifyOtpTokenService) {
        super();
        this.refreshOtpToken = async (req, res, next) => {
            return this.handleResultData(res, next, this.authRefreshOtpTokenService.execute(res.trace, req.body), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.verifyOtpToken = async (req, res, next) => {
            return this.handleResultData(res, next, this.authVerifyOtpTokenService.execute(res.trace, req.body), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.controllerName = "AuthOtpTokenController";
        this.authRefreshOtpTokenService = authRefreshOtpTokenService;
        this.authVerifyOtpTokenService = authVerifyOtpTokenService;
    }
    initializeRoutes(router) {
        this.setRouter(router());
        this.addRoute({
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            path: "/auth/otp/refresh",
            handlers: [(0, validateData_1.validateData)(RefreshOtpTokenSchema_1.refreshOtpTokenSchema), this.refreshOtpToken],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
                //TODO: Document error results
                // { applicationStatus: ApplicationStatusEnum.INVALID_INPUT, httpStatus: HttpStatusCodeEnum.BAD_REQUEST },
            ],
            description: "Refresh OTP Token",
            apiDoc: {
                contentType: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
                requireAuth: false,
                schema: new TypeDescriber_1.ResultTDescriber({
                    name: "RefreshOtpTokenResponse",
                    type: TypeDescriber_1.PropTypeEnum.OBJECT,
                    props: {
                        data: new TypeDescriber_1.TypeDescriber({
                            name: "RefreshOtpTokenResponse",
                            type: TypeDescriber_1.PropTypeEnum.OBJECT,
                            props: {
                                data: {
                                    type: TypeDescriber_1.PropTypeEnum.NULL,
                                },
                            },
                        }),
                        error: {
                            type: TypeDescriber_1.PropTypeEnum.STRING,
                        },
                        message: {
                            type: TypeDescriber_1.PropTypeEnum.STRING,
                        },
                        statusCode: {
                            type: TypeDescriber_1.PropTypeEnum.STRING,
                        },
                        success: {
                            type: TypeDescriber_1.PropTypeEnum.BOOLEAN,
                        },
                    },
                }),
                requestBody: {
                    description: "RefreshOtpTokenRequest",
                    contentType: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
                    schema: new TypeDescriber_1.TypeDescriber({
                        name: "RefreshOtpTokenRequest",
                        type: TypeDescriber_1.PropTypeEnum.OBJECT,
                        props: {
                            email: {
                                type: TypeDescriber_1.PropTypeEnum.STRING,
                                required: true,
                            },
                        },
                    }),
                },
            },
        });
        this.addRoute({
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            path: "/auth/otp/verify",
            handlers: [(0, validateData_1.validateData)(VerifyOtpSchema_1.verifyOtpTokenSchema), this.verifyOtpToken],
            produces: [
                {
                    applicationStatus: ApplicationStatus_enum_1.default.SUCCESS,
                    httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS,
                },
                //TODO: Document error results
                // { applicationStatus: ApplicationStatusEnum.INVALID_INPUT, httpStatus: HttpStatusCodeEnum.BAD_REQUEST },
            ],
            description: "Verify OTP Token",
            apiDoc: {
                contentType: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
                requireAuth: false,
                schema: new TypeDescriber_1.ResultTDescriber({
                    name: "VerifyOtpTokenResponse",
                    type: TypeDescriber_1.PropTypeEnum.OBJECT,
                    props: {
                        data: new TypeDescriber_1.TypeDescriber({
                            name: "VerifyOtpTokenResponse",
                            type: TypeDescriber_1.PropTypeEnum.OBJECT,
                            props: {
                                id: {
                                    type: TypeDescriber_1.PropTypeEnum.NUMBER,
                                },
                                firstName: {
                                    type: TypeDescriber_1.PropTypeEnum.STRING,
                                },
                                lastName: {
                                    type: TypeDescriber_1.PropTypeEnum.STRING,
                                },
                                phoneNumber: {
                                    type: TypeDescriber_1.PropTypeEnum.STRING,
                                },
                                email: {
                                    type: TypeDescriber_1.PropTypeEnum.STRING,
                                },
                                hasVerified: {
                                    type: TypeDescriber_1.PropTypeEnum.BOOLEAN,
                                },
                                isFirstTimeLogin: {
                                    type: TypeDescriber_1.PropTypeEnum.BOOLEAN,
                                },
                                lastLoginDate: {
                                    type: TypeDescriber_1.PropTypeEnum.STRING,
                                    // TODO - refactor to date time
                                    format: TypeDescriber_1.PropFormatEnum.DATE,
                                },
                                userType: {
                                    type: TypeDescriber_1.PropTypeEnum.STRING,
                                },
                                tenantId: { type: TypeDescriber_1.PropTypeEnum.NUMBER },
                            },
                        }),
                        error: {
                            type: TypeDescriber_1.PropTypeEnum.STRING,
                        },
                        message: {
                            type: TypeDescriber_1.PropTypeEnum.STRING,
                        },
                        statusCode: {
                            type: TypeDescriber_1.PropTypeEnum.STRING,
                        },
                        success: {
                            type: TypeDescriber_1.PropTypeEnum.BOOLEAN,
                        },
                    },
                }),
                requestBody: {
                    description: "VerifyOtpTokenRequest",
                    contentType: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
                    schema: new TypeDescriber_1.TypeDescriber({
                        name: "VerifyOtpTokenRequest",
                        type: TypeDescriber_1.PropTypeEnum.OBJECT,
                        props: {
                            id: {
                                type: TypeDescriber_1.PropTypeEnum.NUMBER,
                                required: true,
                            },
                            otpToken: {
                                type: TypeDescriber_1.PropTypeEnum.STRING,
                                required: true,
                            },
                        },
                    }),
                },
            },
        });
    }
};
AuthOtpTokenController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [AuthRefreshOtpToken_service_1.default, AuthVerifyOtpToken_service_1.default])
], AuthOtpTokenController);
exports.default = AuthOtpTokenController;
//# sourceMappingURL=AuthOtpToken.controller.js.map