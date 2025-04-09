"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
class GroupReadProvider {
    async getAllGroup(tx) {
        const dbClient = tx ? tx : database_1.default;
        const groups = await dbClient?.group?.findMany();
        return groups;
    }
    async getByCriteria(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const groups = await dbClient?.group?.findMany({
            where: criteria,
        });
        return groups;
    }
    async getOneByCriteria(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const group = await dbClient?.group?.findFirst({
            where: criteria,
        });
        return group;
    }
}
exports.default = GroupReadProvider;
//# sourceMappingURL=GroupRead.provider.js.map