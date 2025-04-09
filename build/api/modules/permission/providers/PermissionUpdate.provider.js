"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
class PermissionUpdateProvider {
    async updateOne(criteria, updateData, tx) {
        const dbClient = tx ? tx : database_1.default;
        const updatedPermission = await dbClient?.permission?.update({
            where: criteria,
            data: updateData,
        });
        return updatedPermission;
    }
    async updateMany(criteria, updateData, tx) {
        const dbClient = tx ? tx : database_1.default;
        const updatedPermissions = await dbClient?.permission?.updateMany({
            where: criteria,
            data: updateData,
        });
        return updatedPermissions;
    }
}
exports.default = PermissionUpdateProvider;
//# sourceMappingURL=PermissionUpdate.provider.js.map