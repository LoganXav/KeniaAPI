"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatusResolver = void 0;
const DefaultValue_1 = require("../../../../utils/DefaultValue");
const StatusMapping_1 = __importDefault(require("./StatusMapping"));
class HttpStatusResolver {
    static getCode(applicationStatusCode) {
        return DefaultValue_1.DefaultValue.evaluateAndGet(StatusMapping_1.default[applicationStatusCode], StatusMapping_1.default.default);
    }
}
exports.HttpStatusResolver = HttpStatusResolver;
//# sourceMappingURL=HttpStatusResolver.js.map