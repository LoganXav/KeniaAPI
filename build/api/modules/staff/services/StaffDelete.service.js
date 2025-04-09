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
var DeleteStaffService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const Base_service_1 = require("../../base/services/Base.service");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const tsyringe_1 = require("tsyringe");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const LoggingProviderFactory_1 = require("../../../../infrastructure/internal/logger/LoggingProviderFactory");
const SystemMessages_2 = require("../../../shared/helpers/messages/SystemMessages");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const StaffDelete_provider_1 = __importDefault(require("../providers/StaffDelete.provider"));
let DeleteStaffService = DeleteStaffService_1 = class DeleteStaffService extends Base_service_1.BaseService {
    constructor(staffDeleteProvider) {
        super(DeleteStaffService_1.serviceName);
        this.staffDeleteProvider = staffDeleteProvider;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async execute(trace, args) {
        try {
            this.initializeServiceTrace(trace, args, ["deleteStaff"]);
            const staff = await this.staffDeleteProvider.deleteOne(args);
            if (staff) {
                trace.setSuccessful();
                this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, `Delete Staff Information!!!`, staff);
                return this.result;
            }
            else {
                throw new BadRequestError_1.BadRequestError(`${SystemMessages_1.DELETE_ERROR}`);
            }
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_2.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
    async deleteStaffs(trace, args) {
        try {
            this.initializeServiceTrace(trace, args, ["deleteStaffs"]);
            const staffs = await this.staffDeleteProvider.deleteMany(args);
            if (staffs) {
                trace.setSuccessful();
                this.result.setData(SystemMessages_1.SUCCESS, HttpStatusCode_enum_1.HttpStatusCodeEnum.SUCCESS, `Delete Staffs Information`, staffs);
                return this.result;
            }
            else {
                throw new BadRequestError_1.BadRequestError(`Staff ${SystemMessages_1.NOT_FOUND}`, HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
            }
        }
        catch (error) {
            this.loggingProvider.error(error);
            this.result.setError(SystemMessages_2.ERROR, error.httpStatusCode, error.description);
            return this.result;
        }
    }
};
DeleteStaffService.serviceName = "DeleteStaffService";
DeleteStaffService = DeleteStaffService_1 = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [StaffDelete_provider_1.default])
], DeleteStaffService);
exports.default = DeleteStaffService;
//# sourceMappingURL=StaffDelete.service.js.map