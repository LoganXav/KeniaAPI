"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class StudentGroupDeleteProvider {
    async delete(args, dbClient = database_1.default) {
        try {
            const { id, tenantId } = args;
            const studentGroup = await dbClient.studentGroup.delete({
                where: {
                    id,
                    tenantId,
                },
                include: {
                    students: true,
                },
            });
            return studentGroup;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = StudentGroupDeleteProvider;
//# sourceMappingURL=StudentGroupDelete.provider.js.map