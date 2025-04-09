"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class MedicalHistoryUpdateProvider {
    async update(args, dbClient = database_1.default) {
        try {
            const { id, name, description, studentId, tenantId } = args;
            const medicalHistory = await dbClient.medicalHistory.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(studentId && { studentId }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    student: true,
                },
            });
            return medicalHistory;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = MedicalHistoryUpdateProvider;
//# sourceMappingURL=MedicalHistoryUpdate.provider.js.map