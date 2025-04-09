"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
class StaffDeleteProvider {
    async deleteOneByCriteria(criteria, dbClient = database_1.default) {
        const { id } = criteria;
        const deletedTenant = await dbClient?.tenant?.delete({
            where: { id },
        });
        return deletedTenant;
    }
    async deleteByCriteria(criteria, dbClient = database_1.default) {
        const deletedTenant = await dbClient?.tenant?.deleteMany({
            where: criteria,
        });
        return deletedTenant;
    }
}
exports.default = StaffDeleteProvider;
//# sourceMappingURL=TenantDelete.provider.js.map