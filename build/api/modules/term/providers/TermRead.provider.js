"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class TermReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, calendarId, tenantId } = criteria;
            const terms = await dbClient.term.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(calendarId && { calendarId }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    calendar: true,
                    breakWeeks: true,
                },
            });
            return terms;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, calendarId, tenantId } = criteria;
            const term = await dbClient.term.findFirst({
                where: {
                    ...(id && { id: Number(id) }),
                    ...(calendarId && { calendarId: Number(calendarId) }),
                    ...(tenantId && { tenantId: Number(tenantId) }),
                },
                include: {
                    breakWeeks: true,
                },
            });
            return term;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = TermReadProvider;
//# sourceMappingURL=TermRead.provider.js.map