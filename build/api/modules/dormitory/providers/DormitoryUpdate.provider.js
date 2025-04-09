"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class DormitoryUpdateProvider {
    async update(args, dbClient = database_1.default) {
        try {
            const { id, name, tenantId } = args;
            const dormitory = await dbClient.dormitory.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(tenantId && { tenantId }),
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
exports.default = DormitoryUpdateProvider;
//# sourceMappingURL=DormitoryUpdate.provider.js.map