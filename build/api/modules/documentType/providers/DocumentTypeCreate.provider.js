"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class DocumentTypeCreateProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const { name, tenantId } = args;
            const documentType = await dbClient.documentType.create({
                data: {
                    name,
                    tenantId,
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
exports.default = DocumentTypeCreateProvider;
//# sourceMappingURL=DocumentTypeCreate.provider.js.map