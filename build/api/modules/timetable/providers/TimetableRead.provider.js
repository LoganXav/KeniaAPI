"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class TimetableReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, classDivisionId, day, tenantId } = criteria;
            const timetables = await dbClient.timetable.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(classDivisionId && { classDivisionId }),
                    ...(day && { day }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    periods: {
                        include: {
                            subject: true,
                        },
                    },
                },
            });
            return timetables;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, classDivisionId, day, tenantId, termId } = criteria;
            const timetable = await dbClient.timetable.findFirst({
                where: {
                    ...(id && { id: Number(id) }),
                    ...(termId && { termId: Number(termId) }),
                    ...(classDivisionId && { classDivisionId: Number(classDivisionId) }),
                    ...(day && { day }),
                    ...(tenantId && { tenantId: Number(tenantId) }),
                },
                include: {
                    periods: {
                        include: {
                            subject: true,
                        },
                    },
                },
            });
            return timetable;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = TimetableReadProvider;
//# sourceMappingURL=TimetableRead.provider.js.map