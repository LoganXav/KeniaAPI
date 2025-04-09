"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class TermCreateProvider {
    async createOrUpdate(args, dbClient = database_1.default) {
        try {
            const { id, name, startDate, endDate, calendarId, tenantId } = args;
            const term = await dbClient.term.upsert({
                where: { id: id || 0 },
                update: {
                    name,
                    startDate,
                    endDate,
                    calendarId,
                    tenantId,
                },
                create: {
                    name,
                    startDate,
                    endDate,
                    calendarId,
                    tenantId,
                },
            });
            return term;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = TermCreateProvider;
//# sourceMappingURL=TermCreate.provider.js.map