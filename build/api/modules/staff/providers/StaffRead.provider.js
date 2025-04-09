"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class StaffReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { ids, jobTitle, userId, roleId, tenantId } = criteria;
            const staffs = await dbClient.staff.findMany({
                where: {
                    ...(tenantId && { tenantId }),
                    ...(ids && { id: { in: ids } }),
                    ...(jobTitle && { jobTitle: { contains: jobTitle } }),
                    ...(userId && { userId }),
                    ...(roleId && { roleId }),
                },
                include: {
                    user: true,
                    role: true,
                    subjects: true,
                    classes: true,
                },
            });
            staffs.forEach((staff) => {
                if (staff?.user) {
                    delete staff.user.password;
                }
            });
            return staffs;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, tenantId } = criteria;
            const numericId = id ? Number(id) : undefined;
            const staff = await dbClient?.staff?.findFirst({
                where: {
                    ...(tenantId && { tenantId }),
                    ...(numericId && { id: numericId }),
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
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = StaffReadProvider;
//# sourceMappingURL=StaffRead.provider.js.map