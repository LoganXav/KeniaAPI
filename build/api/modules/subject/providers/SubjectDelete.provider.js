"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class SubjectDeleteProvider {
    async delete(criteria, dbClient = database_1.default) {
        try {
            const { id, tenantId } = criteria;
            const subject = await dbClient.subject.delete({
                where: {
                    id,
                    tenantId,
                },
            });
            return subject;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = SubjectDeleteProvider;
//# sourceMappingURL=SubjectDelete.provider.js.map