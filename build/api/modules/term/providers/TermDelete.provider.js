"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class TermDeleteProvider {
    async delete(args, dbClient = database_1.default) {
        try {
            const { id, tenantId } = args;
            const term = await dbClient.term.delete({
                where: {
                    id,
                    tenantId,
                },
                include: {
                    breakWeeks: true,
                },
            });
            return term;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = TermDeleteProvider;
//# sourceMappingURL=TermDelete.provider.js.map