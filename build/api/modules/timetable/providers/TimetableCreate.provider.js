"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class TimetableCreateProvider {
    async createOrUpdate(args, dbClient = database_1.default) {
        try {
            const { id, day, classDivisionId, tenantId, termId } = args;
            const timetable = await dbClient.timetable.upsert({
                where: { id: id || 0 },
                update: {
                    day,
                    classDivisionId,
                    tenantId,
                    termId,
                },
                create: {
                    day,
                    classDivisionId,
                    tenantId,
                    termId,
                },
            });
            return timetable;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = TimetableCreateProvider;
//# sourceMappingURL=TimetableCreate.provider.js.map