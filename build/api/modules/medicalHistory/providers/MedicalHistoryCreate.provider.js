"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class MedicalHistoryCreateProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const { name, description, studentId, tenantId } = args;
            const medicalHistory = await dbClient.medicalHistory.create({
                data: {
                    name,
                    description,
                    studentId,
                    tenantId,
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
exports.default = MedicalHistoryCreateProvider;
//# sourceMappingURL=MedicalHistoryCreate.provider.js.map