"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class DocumentTypeUpdateProvider {
    async update(criteria, dbClient = database_1.default) {
        try {
            const { id, name, tenantId } = criteria;
            const documentType = await dbClient.documentType.update({
                where: { id },
                data: {
                    ...(name && { name }),
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
exports.default = DocumentTypeUpdateProvider;
//# sourceMappingURL=DocumentTypeUpdate.provider.js.map