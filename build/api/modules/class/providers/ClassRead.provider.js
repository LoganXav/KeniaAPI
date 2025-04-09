"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class ClassReadProvider {
    async getAllClass(dbClient = database_1.default) {
        const classes = await dbClient?.class?.findMany();
        return classes;
    }
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, ids, name, classTeacherId, tenantId } = criteria;
            const classes = await dbClient.class.findMany({
                where: {
                    ...(id && { id }),
                    ...(ids && { id: { in: ids } }),
                    ...(name && { name }),
                    ...(classTeacherId && { classTeacherId }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    classTeacher: {
                        include: {
                            user: true,
                        },
                    },
                    // students: true,
                    subjects: true,
                    divisions: true,
                },
            });
            return classes;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, name, classTeacherId, tenantId } = criteria;
            const class_ = await dbClient.class.findFirst({
                where: {
                    ...(id && { id }),
                    ...(name && { name }),
                    ...(classTeacherId && { classTeacherId }),
                    ...(tenantId && { tenantId }),
                },
                include: {
                    classTeacher: {
                        include: {
                            user: true,
                        },
                    },
                    // students: true,
                    subjects: true,
                    divisions: true,
                },
            });
            return class_;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = ClassReadProvider;
//# sourceMappingURL=ClassRead.provider.js.map