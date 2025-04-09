"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class ClassDivisionCreateProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const { name, classId, tenantId } = args;
            const classDivision = await dbClient.classDivision.create({
                data: {
                    name,
                    classId,
                    tenantId,
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
exports.default = ClassDivisionCreateProvider;
//# sourceMappingURL=ClassDivisionCreate.provider.js.map