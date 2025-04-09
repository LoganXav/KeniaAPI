"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
class ClassUpdateProvider {
    async updateOne(args, dbClient = database_1.default) {
        const updatedClass = await dbClient?.class?.update({
            where: { id: args.id },
            data: {
                ...(args.name && { name: args.name }),
                ...(args.classTeacherId && { classTeacherId: args.classTeacherId }),
            },
            include: {
                classTeacher: true,
                students: true,
                subjects: true,
                divisions: true,
            },
        });
        return updatedClass;
    }
}
exports.default = ClassUpdateProvider;
//# sourceMappingURL=ClassUpdate.provider.js.map