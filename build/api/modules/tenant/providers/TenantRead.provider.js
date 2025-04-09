"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class TenantReadProvider {
    async getAllTenant(tx) {
        const dbClient = tx ? tx : database_1.default;
        const tenants = await dbClient?.tenants?.findMany();
        return tenants;
    }
    async getByCriteria(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const staffs = await dbClient?.staff?.findMany({
            where: criteria,
        });
        return staffs;
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id } = criteria;
            const result = await dbClient?.tenant?.findFirst({
                where: {
                    ...(id && { id }),
                },
                include: {
                    staffs: {
                        include: {
                            role: true,
                        },
                    },
                    students: true,
                    metadata: true,
                },
            });
            return result;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = TenantReadProvider;
//# sourceMappingURL=TenantRead.provider.js.map