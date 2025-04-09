"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class StaffUpdateProvider {
    async updateOne(criteria, dbClient = database_1.default) {
        try {
            const { jobTitle, roleId, id, tenantId, nin, tin, cvUrl, highestLevelEdu, employmentType, startDate, subjectIds, classIds } = criteria;
            const numericId = Number(id);
            const updatedStaff = await dbClient?.staff?.update({
                where: {
                    id: numericId,
                    tenantId,
                },
                data: {
                    ...(jobTitle && { jobTitle }),
                    ...(roleId && { roleId }),
                    ...(nin && { nin }),
                    ...(tin && { tin }),
                    ...(cvUrl && { cvUrl }),
                    ...(highestLevelEdu && { highestLevelEdu }),
                    ...(employmentType && { employmentType }),
                    ...(startDate && { startDate }),
                    ...(subjectIds && {
                        subjects: {
                            connect: subjectIds.map((id) => ({ id })),
                        },
                    }),
                    ...(classIds && {
                        classes: {
                            connect: classIds.map((id) => ({ id })),
                        },
                    }),
                },
                include: {
                    user: true,
                    role: true,
                    subjects: true,
                    classes: true,
                },
            });
            if (updatedStaff?.user) {
                delete updatedStaff.user.password;
            }
            return updatedStaff;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
    async updateMany(criteria, dbClient = database_1.default) {
        try {
            const { roleId, jobTitle, ids, tenantId } = criteria;
            const updatedStaffs = await dbClient?.staff?.updateMany({
                where: {
                    id: {
                        in: ids,
                    },
                    tenantId,
                },
                data: {
                    ...(roleId && { roleId }),
                    ...(jobTitle && { jobTitle }),
                },
            });
            return updatedStaffs;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = StaffUpdateProvider;
//# sourceMappingURL=StaffUpdate.provider.js.map