"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class TimetableDeleteProvider {
    async delete(args, dbClient = database_1.default) {
        try {
            const { id, tenantId } = args;
            const timetable = await dbClient.timetable.delete({
                where: {
                    id,
                    tenantId,
                },
                include: {
                    periods: true,
                },
            });
            return timetable;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = TimetableDeleteProvider;
//# sourceMappingURL=TimetableDelete.provider.js.map