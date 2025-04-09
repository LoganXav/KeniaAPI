"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class MedicalHistoryReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, name, studentId, tenantId } = criteria;
            const medicalHistories = await dbClient.medicalHistory.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(name && { name: { contains: name } }),
                    ...(studentId && { studentId }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    student: true,
                },
            });
            return medicalHistories;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, name, studentId, tenantId } = criteria;
            const medicalHistory = await dbClient.medicalHistory.findFirst({
                where: {
                    ...(id && { id }),
                    ...(name && { name: { contains: name } }),
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
exports.default = MedicalHistoryReadProvider;
//# sourceMappingURL=MedicalHistoryRead.provider.js.map