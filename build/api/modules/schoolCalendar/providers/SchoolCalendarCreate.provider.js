"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class SchoolCalendarCreateProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const { year, tenantId } = args;
            const schoolCalendar = await dbClient.schoolCalendar.create({
                data: {
                    year,
                    tenantId,
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
    async createOrUpdate(args, dbClient = database_1.default) {
        try {
            const { id, year, tenantId } = args;
            const schoolCalendar = await dbClient.schoolCalendar.upsert({
                where: { id: id || 0 },
                update: {
                    year,
                    tenantId,
                },
                create: {
                    year,
                    tenantId,
                },
            });
            return schoolCalendar;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = SchoolCalendarCreateProvider;
//# sourceMappingURL=SchoolCalendarCreate.provider.js.map