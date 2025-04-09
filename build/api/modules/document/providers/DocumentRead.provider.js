"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class DocumentReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, name, studentId, documentTypeId, tenantId } = criteria;
            const documents = await dbClient.document.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(name && { name: { contains: name } }),
                    ...(studentId && { studentId }),
                    ...(documentTypeId && { documentTypeId }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    documentType: true,
                },
            });
            return documents;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, name, studentId, documentTypeId, tenantId } = criteria;
            const document = await dbClient.document.findFirst({
                where: {
                    ...(id && { id }),
                    ...(name && { name: { contains: name } }),
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
exports.default = DocumentReadProvider;
//# sourceMappingURL=DocumentRead.provider.js.map