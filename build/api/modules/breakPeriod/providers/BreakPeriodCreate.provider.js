"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class BreakPeriodCreateProvider {
    async createOrUpdate(args, dbClient = database_1.default) {
        try {
            const { id, name, startDate, endDate, termId, tenantId } = args;
            const breakPeriod = await dbClient.breakPeriod.upsert({
                where: { id: id || 0 },
                update: {
                    name,
                    startDate,
                    endDate,
                    termId,
                    tenantId,
                },
                create: {
                    name,
                    startDate,
                    endDate,
                    termId,
                    tenantId,
                },
            });
            return breakPeriod;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = BreakPeriodCreateProvider;
//# sourceMappingURL=BreakPeriodCreate.provider.js.map