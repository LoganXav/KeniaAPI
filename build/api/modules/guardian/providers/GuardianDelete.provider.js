"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class GuardianDeleteProvider {
    async delete(args, dbClient = database_1.default) {
        try {
            const { id, tenantId } = args;
            const guardian = await dbClient.guardian.delete({
                where: {
                    id,
                    tenantId,
                },
                include: {
                    students: true,
                },
            });
            return guardian;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = GuardianDeleteProvider;
//# sourceMappingURL=GuardianDelete.provider.js.map