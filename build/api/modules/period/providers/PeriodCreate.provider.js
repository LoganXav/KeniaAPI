"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class PeriodCreateProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const { startTime, endTime, subjectId, timetableId, isBreak, breakType, tenantId } = args;
            const period = await dbClient.period.create({
                data: {
                    startTime,
                    endTime,
                    subjectId,
                    timetableId,
                    isBreak,
                    breakType,
                    tenantId,
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
    async createOrUpdate(args, dbClient = database_1.default) {
        try {
            const { id, startTime, endTime, subjectId, timetableId, isBreak, breakType, tenantId } = args;
            const period = await dbClient.period.upsert({
                where: { id: id || 0 },
                update: {
                    startTime,
                    endTime,
                    subjectId,
                    timetableId,
                    isBreak,
                    breakType,
                    tenantId,
                },
                create: {
                    startTime,
                    endTime,
                    subjectId,
                    timetableId,
                    isBreak,
                    breakType,
                    tenantId,
                },
            });
            return period;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = PeriodCreateProvider;
//# sourceMappingURL=PeriodCreate.provider.js.map