"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class DormitoryDeleteProvider {
    async delete(args, dbClient = database_1.default) {
        try {
            const { id, tenantId } = args;
            const dormitory = await dbClient.dormitory.delete({
                where: {
                    id,
                    tenantId,
                },
                include: {
                    students: true,
                },
            });
            return dormitory;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = DormitoryDeleteProvider;
//# sourceMappingURL=DormitoryDelete.provider.js.map