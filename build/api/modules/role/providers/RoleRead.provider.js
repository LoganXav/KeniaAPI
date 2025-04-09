"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
class RoleReadProvider {
    async getAllRole(tx) {
        const dbClient = tx ? tx : database_1.default;
        const roles = await dbClient?.role?.findMany();
        return roles;
    }
    async getByCriteria(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const roles = await dbClient?.role?.findMany({
            where: criteria,
        });
        return roles;
    }
    async getOneByCriteria(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const role = await dbClient?.role?.findFirst({
            where: criteria,
        });
        return role;
    }
}
exports.default = RoleReadProvider;
//# sourceMappingURL=RoleRead.provider.js.map