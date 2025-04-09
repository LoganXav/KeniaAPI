"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class DormitoryReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, name, tenantId } = criteria;
            const dormitories = await dbClient.dormitory.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(name && { name: { contains: name } }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    students: true,
                },
            });
            return dormitories;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, name, tenantId } = criteria;
            const dormitory = await dbClient.dormitory.findFirst({
                where: {
                    ...(id && { id }),
                    ...(name && { name: { contains: name } }),
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
exports.default = DormitoryReadProvider;
//# sourceMappingURL=DormitoryRead.provider.js.map