"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class SchoolCalendarReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, year, tenantId } = criteria;
            const schoolCalendars = await dbClient.schoolCalendar.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(year && { year }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    terms: {
                        include: {
                            breakWeeks: true,
                        },
                    },
                },
            });
            return schoolCalendars;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, year, tenantId } = criteria;
            const schoolCalendar = await dbClient.schoolCalendar.findFirst({
                where: {
                    ...(id && { id }),
                    ...(year && { year }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    terms: {
                        include: {
                            breakWeeks: true,
                        },
                    },
                },
            });
            return schoolCalendar;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = SchoolCalendarReadProvider;
//# sourceMappingURL=SchoolCalendarRead.provider.js.map