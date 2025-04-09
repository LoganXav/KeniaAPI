"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class DocumentTypeReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, name, tenantId } = criteria;
            const documentTypes = await dbClient.documentType.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(name && { name: { contains: name } }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    document: true,
                },
            });
            return documentTypes;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, name, tenantId } = criteria;
            const documentType = await dbClient.documentType.findFirst({
                where: {
                    ...(id && { id }),
                    ...(name && { name: { contains: name } }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    document: true,
                },
            });
            return documentType;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = DocumentTypeReadProvider;
//# sourceMappingURL=DocumentTypeRead.provider.js.map