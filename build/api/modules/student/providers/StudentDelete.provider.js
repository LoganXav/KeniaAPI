"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class StudentDeleteProvider {
    async deleteOne(criteria, tx) {
        try {
            const dbClient = tx ? tx : database_1.default;
            const toDelete = await dbClient?.student?.findFirst({
                where: criteria,
                include: {
                    guardians: true,
                    documents: true,
                    dormitory: true,
                    medicalHistory: true,
                    studentGroups: true,
                },
            });
            if (!toDelete) {
                throw new BadRequestError_1.BadRequestError(`Student ${SystemMessages_1.NOT_FOUND}`, HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
            }
            // First delete related records
            await Promise.all([
                dbClient.guardian.deleteMany({ where: { studentId: toDelete.id } }),
                dbClient.document.deleteMany({ where: { studentId: toDelete.id } }),
                dbClient.dormitory.deleteMany({ where: { studentId: toDelete.id } }),
                dbClient.medicalHistory.deleteMany({ where: { studentId: toDelete.id } }),
            ]);
            // Then delete the student
            const deletedStudent = await dbClient?.student?.delete({
                where: { id: toDelete.id },
                include: {
                    user: true,
                    class: true,
                    guardians: true,
                    documents: true,
                    dormitory: true,
                    medicalHistory: true,
                    studentGroups: true,
                },
            });
            // Finally delete the associated user
            if (deletedStudent?.user) {
                await dbClient?.user?.delete({
                    where: { id: deletedStudent.userId },
                });
            }
            return deletedStudent;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
    async deleteMany(criteria, tx) {
        try {
            const dbClient = tx ? tx : database_1.default;
            const students = await dbClient?.student?.findMany({
                where: criteria,
                select: {
                    id: true,
                    userId: true,
                },
            });
            if (!students.length) {
                throw new BadRequestError_1.BadRequestError(`No students found to delete`, HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
            }
            const studentIds = students.map((student) => student.id);
            const userIds = students.map((student) => student.userId);
            // Delete all related records and students in a transaction
            const result = await dbClient.$transaction([
                dbClient.guardian.deleteMany({ where: { studentId: { in: studentIds } } }),
                dbClient.document.deleteMany({ where: { studentId: { in: studentIds } } }),
                dbClient.dormitory.deleteMany({ where: { studentId: { in: studentIds } } }),
                dbClient.medicalHistory.deleteMany({ where: { studentId: { in: studentIds } } }),
                dbClient.student.deleteMany({ where: criteria }),
                dbClient.user.deleteMany({ where: { id: { in: userIds } } }),
            ]);
            return { count: result[4].count }; // Return the count of deleted students
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = StudentDeleteProvider;
//# sourceMappingURL=StudentDelete.provider.js.map