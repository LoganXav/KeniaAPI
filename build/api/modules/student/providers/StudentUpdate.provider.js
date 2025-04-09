"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class StudentUpdateProvider {
    async updateOne(criteria, dbClient = database_1.default) {
        try {
            const { classId, classDivisionId, guardianIds, id, tenantId, dormitoryId, studentGroupIds } = criteria;
            const updatedStudent = await dbClient?.student?.update({
                where: { id, tenantId },
                data: {
                    ...(classId && { class: { connect: { id: Number(classId) } } }),
                    ...(classDivisionId && { classDivision: { connect: { id: Number(classDivisionId) } } }),
                    ...(dormitoryId && { dormitory: { connect: { id: Number(dormitoryId) } } }),
                    ...(studentGroupIds && { studentGroups: { connect: studentGroupIds.map((id) => ({ id })) } }),
                    guardians: {
                        set: guardianIds?.map((id) => ({ id })) || [],
                    },
                },
                include: {
                    user: true,
                    class: true,
                    classDivision: true,
                    guardians: true,
                    documents: true,
                    dormitory: true,
                    medicalHistory: true,
                    studentGroups: true,
                    subjects: true,
                },
            });
            if (updatedStudent.user) {
                delete updatedStudent.user.password;
            }
            return updatedStudent;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
    async updateMany(criteria, dbClient = database_1.default) {
        try {
            const { ids, classId, tenantId, dormitoryId, guardianIds } = criteria;
            const updatedStudents = await dbClient?.student?.updateMany({
                where: {
                    id: {
                        in: ids,
                    },
                    tenantId,
                },
                data: {
                    ...(classId && { classId: Number(classId) }),
                    ...(dormitoryId && { dormitoryId: Number(dormitoryId) }),
                    ...(guardianIds && {
                        guardians: {
                            connect: guardianIds?.map((id) => ({ id })),
                        },
                    }),
                },
            });
            return updatedStudents;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = StudentUpdateProvider;
//# sourceMappingURL=StudentUpdate.provider.js.map