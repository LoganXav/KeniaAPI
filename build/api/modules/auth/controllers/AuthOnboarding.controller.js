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
const AuthSignUp_service_1 = __importDefault(require("../services/AuthSignUp.service"));
const AuthSignIn_service_1 = __importDefault(require("../services/AuthSignIn.service"));
const Base_controller_1 = __importDefault(require("../../base/contollers/Base.controller"));
const HttpMethod_enum_1 = require("../../../shared/helpers/enums/HttpMethod.enum");
const HttpHeader_enum_1 = require("../../../shared/helpers/enums/HttpHeader.enum");
const validateData_1 = require("../../../shared/helpers/middleware/validateData");
const SignUpUserRecordSchema_1 = require("../validators/SignUpUserRecordSchema");
const SignInUserRecordSchema_1 = require("../validators/SignInUserRecordSchema");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const HttpContentType_enum_1 = require("../../../shared/helpers/enums/HttpContentType.enum");
const ApplicationStatus_enum_1 = __importDefault(require("../../../shared/helpers/enums/ApplicationStatus.enum"));
const TypeDescriber_1 = require("../../../../infrastructure/internal/documentation/TypeDescriber");
let AuthOnboardingController = class AuthOnboardingController extends Base_controller_1.default {
    constructor(authSignUpService, authSignInService) {
        super();
        this.signUp = async (req, res, next) => {
            return this.handleResultData(res, next, this.authSignUpService.execute(res.trace, req.body), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.signIn = async (req, res, next) => {
            return this.handleResultData(res, next, this.authSignInService.execute(res.trace, req.body), {
                [HttpHeader_enum_1.HttpHeaderEnum.CONTENT_TYPE]: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
            });
        };
        this.controllerName = "AuthOnboardingController";
        this.authSignUpService = authSignUpService;
        this.authSignInService = authSignInService;
    }
    initializeRoutes(router) {
        this.setRouter(router());
        this.addRoute({
            method: HttpMethod_enum_1.HttpMethodEnum.POST,
            path: "/auth/signup",
            handlers: [(0, validateData_1.validateData)(SignUpUserRecordSchema_1.signUpUserRecordSchema), this.signUp],
            produces: [
                { applicationStatus: ApplicationStatus_enum_1.default.CREATED, httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.CREATED },
                //TODO: Document error results
                // { applicationStatus: ApplicationStatusEnum.INVALID_INPUT, httpStatus: HttpStatusCodeEnum.BAD_REQUEST },
            ],
            description: "Sign Up New Tenant and User Record",
            apiDoc: {
                contentType: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
                requireAuth: false,
                schema: new TypeDescriber_1.ResultTDescriber({
                    name: "SignUpUserResponse",
                    type: TypeDescriber_1.PropTypeEnum.OBJECT,
                    props: {
                        data: new TypeDescriber_1.TypeDescriber({
                            name: "SignUpUserResponse",
                            type: TypeDescriber_1.PropTypeEnum.OBJECT,
                            props: {
                                id: {
                                    type: TypeDescriber_1.PropTypeEnum.NUMBER,
                                },
                                tenantId: {
                                    type: TypeDescriber_1.PropTypeEnum.NUMBER,
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
                    description: "SignUpUserRequest",
                    contentType: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
                    schema: new TypeDescriber_1.TypeDescriber({
                        name: "SignUpUserRequest",
                        type: TypeDescriber_1.PropTypeEnum.OBJECT,
                        props: {
                            firstName: {
                                type: TypeDescriber_1.PropTypeEnum.STRING,
                                required: true,
                            },
                            lastName: {
                                type: TypeDescriber_1.PropTypeEnum.STRING,
                                required: true,
                            },
                            phoneNumber: {
                                type: TypeDescriber_1.PropTypeEnum.STRING,
                                required: true,
                            },
                            email: {
                                type: TypeDescriber_1.PropTypeEnum.STRING,
                                required: true,
                            },
                            password: {
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
            path: "/auth/signin",
            handlers: [(0, validateData_1.validateData)(SignInUserRecordSchema_1.signInUserRecordSchema), this.signIn],
            produces: [
                { applicationStatus: ApplicationStatus_enum_1.default.SUCCESS, httpStatus: HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS },
                //TODO: Document error results
                // { applicationStatus: ApplicationStatusEnum.UNAUTHORIZED, httpStatus: HttpStatusCodeEnum.UNAUTHORIZED },
            ],
            description: "Sign In An Existing User",
            apiDoc: {
                contentType: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
                requireAuth: false,
                schema: new TypeDescriber_1.ResultTDescriber({
                    name: "SignInResponse",
                    type: TypeDescriber_1.PropTypeEnum.OBJECT,
                    props: {
                        data: new TypeDescriber_1.TypeDescriber({
                            name: "SignInResponse",
                            type: TypeDescriber_1.PropTypeEnum.OBJECT,
                            props: {
                                id: {
                                    type: TypeDescriber_1.PropTypeEnum.NUMBER,
                                },
                                tenantId: {
                                    type: TypeDescriber_1.PropTypeEnum.NUMBER,
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
                    description: "SignInRequest",
                    contentType: HttpContentType_enum_1.HttpContentTypeEnum.APPLICATION_JSON,
                    schema: new TypeDescriber_1.TypeDescriber({
                        name: "SignInRequest",
                        type: TypeDescriber_1.PropTypeEnum.OBJECT,
                        props: {
                            email: {
                                type: TypeDescriber_1.PropTypeEnum.STRING,
                                required: true,
                            },
                            password: {
                                type: TypeDescriber_1.PropTypeEnum.STRING,
                                required: true,
                            },
                            userType: {
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
AuthOnboardingController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [AuthSignUp_service_1.default, AuthSignIn_service_1.default])
], AuthOnboardingController);
exports.default = AuthOnboardingController;
//# sourceMappingURL=AuthOnboarding.controller.js.map