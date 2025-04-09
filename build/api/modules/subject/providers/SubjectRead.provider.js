"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class SubjectReadProvider {
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, name, classId, tenantId, staffIds } = criteria;
            const subjects = await dbClient.subject.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(name && { name: { contains: name } }),
                    ...(classId && { classId }),
                    ...(tenantId && { tenantId }),
                    ...(staffIds && { staffs: { some: { id: { in: staffIds } } } }),
                },
                include: {
                    class: true,
                    staffs: true,
                },
            });
            return subjects;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, name, classId, tenantId, staffIds } = criteria;
            const subject = await dbClient.subject.findFirst({
                where: {
                    ...(id && { id }),
                    ...(name && { name }),
                    ...(classId && { classId }),
                    ...(tenantId && { tenantId }),
                    ...(staffIds && { staffs: { some: { id: { in: staffIds } } } }),
                },
                include: {
                    class: true,
                    staffs: true,
                },
            });
            return subject;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = SubjectReadProvider;
//# sourceMappingURL=SubjectRead.provider.js.map