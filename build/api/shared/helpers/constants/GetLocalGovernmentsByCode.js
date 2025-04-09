"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLgasByCodeValue = GetLgasByCodeValue;
const NigerianLocalGovernments_constant_1 = __importDefault(require("./NigerianLocalGovernments.constant"));
function GetLgasByCodeValue(codeValue) {
    return NigerianLocalGovernments_constant_1.default.filter((lga) => lga.codeValue === codeValue);
}
//# sourceMappingURL=GetLocalGovernmentsByCode.js.map