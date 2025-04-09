"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
class RoleUpdateProvider {
    async updateOne(criteria, updateData, tx) {
        const dbClient = tx ? tx : database_1.default;
        const updatedRole = await dbClient?.role?.update({
            where: criteria,
            data: updateData,
        });
        return updatedRole;
    }
    async updateMany(criteria, updateData, tx) {
        const dbClient = tx ? tx : database_1.default;
        const updatedRoles = await dbClient?.role?.updateMany({
            where: criteria,
            data: updateData,
        });
        return updatedRoles;
    }
}
exports.default = RoleUpdateProvider;
//# sourceMappingURL=RoleUpdate.provider.js.map