"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class SubjectUpdateProvider {
    async update(criteria, dbClient = database_1.default) {
        try {
            const { id, name, description, classId, tenantId, staffIds } = criteria;
            const subject = await dbClient.subject.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(classId && { classId }),
                    ...(tenantId && { tenantId }),
                    ...(staffIds && {
                        staffs: {
                            connect: staffIds.map((id) => ({ id })),
                        },
                    }),
                },
                include: {
                    class: true,
                },
            });
            return subject;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = SubjectUpdateProvider;
//# sourceMappingURL=SubjectUpdate.provider.js.map