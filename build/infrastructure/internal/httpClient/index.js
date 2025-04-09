"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const InternalServerError_1 = require("../exceptions/InternalServerError");
class HttpClient {
    static async get(getRequestDto) {
        const { url, headers } = getRequestDto;
        const axiosInstance = axios_1.default.create({ headers });
        try {
            const response = await axiosInstance.get(url);
            return response.data;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
    static async post(postRequestDto) {
        const { url, headers, body } = postRequestDto;
        const axiosInstance = axios_1.default.create({ headers });
        try {
            const response = await axiosInstance.post(url, body);
            return response.data;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=index.js.map