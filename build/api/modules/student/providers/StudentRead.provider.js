"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class StudentReadProvider {
    async getAllStudent(dbClient = database_1.default) {
        const students = await dbClient?.student?.findMany({
            include: {
                user: true,
                class: true,
                guardians: true,
                subjects: true,
                classDivision: true,
                documents: true,
                dormitory: true,
                medicalHistory: true,
                studentGroups: true,
            },
        });
        return students;
    }
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { ids, classId, tenantId, dormitoryId } = criteria;
            const students = await dbClient.student.findMany({
                where: {
                    ...(tenantId && { tenantId }),
                    ...(ids && { id: { in: ids } }),
                    ...(dormitoryId && { dormitoryId: Number(dormitoryId) }),
                    ...(classId && { classId: Number(classId) }),
                },
                include: {
                    user: true,
                    class: true,
                    guardians: true,
                    documents: true,
                    dormitory: true,
                    classDivision: true,
                    subjects: true,
                    medicalHistory: true,
                    studentGroups: true,
                },
            });
            students.forEach((student) => {
                if (student.user) {
                    delete student.user.password;
                }
            });
            return students;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, tenantId } = criteria;
            const numericId = id ? Number(id) : undefined;
            const student = await dbClient?.student?.findFirst({
                where: {
                    ...(tenantId && { tenantId }),
                    ...(numericId && { id: numericId }),
                },
                include: {
                    user: true,
                    class: true,
                    guardians: true,
                    documents: true,
                    dormitory: true,
                    medicalHistory: true,
                    studentGroups: true,
                    subjects: true,
                    classDivision: true,
                },
            });
            if (student?.user) {
                delete student.user.password;
            }
            return student;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = StudentReadProvider;
//# sourceMappingURL=StudentRead.provider.js.map