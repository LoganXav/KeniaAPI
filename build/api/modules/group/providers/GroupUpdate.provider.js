"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
class GroupUpdateProvider {
    async updateOne(criteria, updateData, tx) {
        const dbClient = tx ? tx : database_1.default;
        const updatedGroup = await dbClient?.group?.update({
            where: criteria,
            data: updateData,
        });
        return updatedGroup;
    }
    async updateMany(criteria, updateData, tx) {
        const dbClient = tx ? tx : database_1.default;
        const updatedGroups = await dbClient?.group?.updateMany({
            where: criteria,
            data: updateData,
        });
        return updatedGroups;
    }
}
exports.default = GroupUpdateProvider;
//# sourceMappingURL=GroupUpdate.provider.js.map