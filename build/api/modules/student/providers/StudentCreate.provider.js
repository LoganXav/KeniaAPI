"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class StudentCreateProvider {
    async create(data, dbClient = database_1.default) {
        try {
            const { userId, classId, classDivisionId, tenantId, enrollmentDate, dormitoryId, studentGroupIds, guardianIds, subjectIds } = data;
            const student = await dbClient?.student.create({
                data: {
                    userId,
                    tenantId,
                    enrollmentDate,
                    ...(classId !== undefined && { classId }),
                    ...(classDivisionId !== undefined && { classDivisionId }),
                    ...(dormitoryId !== undefined && { dormitoryId }),
                    studentGroups: {
                        connect: studentGroupIds?.map((id) => ({ id })),
                    },
                    guardians: {
                        connect: guardianIds?.map((id) => ({ id })),
                    },
                    subjects: {
                        connect: subjectIds?.map((id) => ({ id })),
                    },
                },
                include: {
                    user: true,
                    class: true,
                    subjects: true,
                    classDivision: true,
                    guardians: true,
                    documents: true,
                    dormitory: true,
                    medicalHistory: true,
                    studentGroups: true,
                },
            });
            if (student.user) {
                delete student.user.password;
            }
            return student;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = StudentCreateProvider;
//# sourceMappingURL=StudentCreate.provider.js.map