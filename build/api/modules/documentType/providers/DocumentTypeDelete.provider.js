"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class DocumentTypeDeleteProvider {
    async delete(criteria, dbClient = database_1.default) {
        try {
            const { id, tenantId } = criteria;
            const documentType = await dbClient.documentType.delete({
                where: {
                    id,
                    tenantId,
                },
            });
            return documentType;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = DocumentTypeDeleteProvider;
//# sourceMappingURL=DocumentTypeDelete.provider.js.map