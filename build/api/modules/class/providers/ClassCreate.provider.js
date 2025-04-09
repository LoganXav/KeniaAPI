"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class ClassCreateProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const { name, tenantId } = args;
            const classRecord = await dbClient.class.create({
                data: {
                    name,
                    tenantId,
                },
                include: {
                    classTeacher: true,
                    students: true,
                    subjects: true,
                    divisions: true,
                },
            });
            return classRecord;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async createMany(args, dbClient = database_1.default) {
        try {
            const data = args.map(({ name, tenantId }) => ({
                name,
                tenantId,
            }));
            const classRecords = await dbClient.class.createMany({
                data,
                skipDuplicates: true,
            });
            return classRecords;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = ClassCreateProvider;
//# sourceMappingURL=ClassCreate.provider.js.map