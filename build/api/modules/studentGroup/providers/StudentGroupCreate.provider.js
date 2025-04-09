"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class StudentGroupCreateProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const { name, tenantId } = args;
            const studentGroup = await dbClient.studentGroup.create({
                data: {
                    name,
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
exports.default = StudentGroupCreateProvider;
//# sourceMappingURL=StudentGroupCreate.provider.js.map