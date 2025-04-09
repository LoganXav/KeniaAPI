"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class PeriodReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, timetableId, subjectId, tenantId } = criteria;
            const periods = await dbClient.period.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(timetableId && { timetableId }),
                    ...(subjectId && { subjectId }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    subject: true,
                },
            });
            return periods;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, timetableId, subjectId, tenantId } = criteria;
            const period = await dbClient.period.findFirst({
                where: {
                    ...(id && { id }),
                    ...(timetableId && { timetableId }),
                    ...(subjectId && { subjectId }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    subject: true,
                },
            });
            return period;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = PeriodReadProvider;
//# sourceMappingURL=PeriodRead.provider.js.map