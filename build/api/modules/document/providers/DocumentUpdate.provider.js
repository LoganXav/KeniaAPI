"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class DocumentUpdateProvider {
    async update(criteria, dbClient = database_1.default) {
        try {
            const { id, name, url, studentId, documentTypeId, tenantId } = criteria;
            const document = await dbClient.document.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(url && { url }),
                    ...(studentId && { studentId }),
                    ...(documentTypeId && { documentTypeId }),
                    ...(tenantId && { tenantId }),
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
exports.default = DocumentUpdateProvider;
//# sourceMappingURL=DocumentUpdate.provider.js.map