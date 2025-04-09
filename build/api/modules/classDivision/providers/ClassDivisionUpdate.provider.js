"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class ClassDivisionUpdateProvider {
    async update(criteria, dbClient = database_1.default) {
        try {
            const { id, name, classId, tenantId } = criteria;
            const classDivision = await dbClient.classDivision.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(classId && { classId }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    class: true,
                    students: true,
                },
            });
            return classDivision;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = ClassDivisionUpdateProvider;
//# sourceMappingURL=ClassDivisionUpdate.provider.js.map