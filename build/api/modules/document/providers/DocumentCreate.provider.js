"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class DocumentCreateProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const { name, url, studentId, documentTypeId, tenantId } = args;
            const document = await dbClient.document.create({
                data: {
                    name,
                    url,
                    ...(studentId && { studentId }),
                    documentTypeId,
                    tenantId,
                },
                include: {
                    documentType: true,
                },
            });
            return document;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = DocumentCreateProvider;
//# sourceMappingURL=DocumentCreate.provider.js.map