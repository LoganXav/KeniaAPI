"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class GuardianReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, firstName, lastName, phoneNumber, email, tenantId, studentIds } = criteria;
            const guardians = await dbClient.guardian.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(firstName && { firstName: { contains: firstName } }),
                    ...(lastName && { lastName: { contains: lastName } }),
                    ...(phoneNumber && { phoneNumber: { contains: phoneNumber } }),
                    ...(email && { email: { contains: email } }),
                    ...(tenantId && { tenantId }),
                    ...(studentIds && { students: { some: { id: { in: studentIds } } } }),
                },
                include: {
                    students: true,
                },
            });
            return guardians;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, firstName, lastName, email, tenantId, studentIds } = criteria;
            const guardian = await dbClient.guardian.findFirst({
                where: {
                    ...(email && { email }),
                    ...(tenantId && { tenantId }),
                    ...(id && { id }),
                    ...(firstName && { firstName: { contains: firstName } }),
                    ...(lastName && { lastName: { contains: lastName } }),
                    ...(studentIds && { students: { some: { id: { in: studentIds } } } }),
                },
                include: {
                    students: true,
                },
            });
            return guardian;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = GuardianReadProvider;
//# sourceMappingURL=GuardianRead.provider.js.map