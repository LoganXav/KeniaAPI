"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class StaffCreateProvider {
    async create(data, dbClient = database_1.default) {
        try {
            const { jobTitle, employmentType, startDate, nin, tin, highestLevelEdu, cvUrl, userId, roleId, tenantId, subjectIds, classIds } = data;
            const staff = await dbClient?.staff.create({
                data: {
                    jobTitle,
                    employmentType,
                    startDate,
                    nin,
                    highestLevelEdu,
                    tin,
                    cvUrl,
                    userId,
                    roleId,
                    tenantId,
                    subjects: {
                        connect: subjectIds?.map((id) => ({ id })),
                    },
                    classes: {
                        connect: classIds?.map((id) => ({ id })),
                    },
                },
                include: {
                    user: true,
                    role: true,
                    subjects: true,
                    classes: true,
                },
            });
            if (staff?.user) {
                delete staff.user.password;
            }
            return staff;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = StaffCreateProvider;
//# sourceMappingURL=StaffCreate.provider.js.map