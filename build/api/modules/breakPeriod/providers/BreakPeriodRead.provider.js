"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class BreakPeriodReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, termId, tenantId } = criteria;
            const breakPeriods = await dbClient.breakPeriod.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(termId && { termId }),
                    ...(tenantId && { tenantId }),
                },
            });
            return breakPeriods;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, termId, tenantId } = criteria;
            const breakPeriod = await dbClient.breakPeriod.findFirst({
                where: {
                    ...(id && { id }),
                    ...(termId && { termId }),
                    ...(tenantId && { tenantId }),
                },
            });
            return breakPeriod;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = BreakPeriodReadProvider;
//# sourceMappingURL=BreakPeriodRead.provider.js.map