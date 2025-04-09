"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
class PermissionReadProvider {
    async getAllPermission(tx) {
        const dbClient = tx ? tx : database_1.default;
        const permissions = await dbClient?.permission?.findMany();
        return permissions;
    }
    async getByCriteria(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const permissions = await dbClient?.permission?.findMany({
            where: criteria,
        });
        return permissions;
    }
    async getOneByCriteria(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const permission = await dbClient?.permission?.findFirst({
            where: criteria,
        });
        return permission;
    }
}
exports.default = PermissionReadProvider;
//# sourceMappingURL=PermissionRead.provider.js.map