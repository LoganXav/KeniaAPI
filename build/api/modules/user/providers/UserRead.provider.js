"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class UserReadProvider {
    async getAll(dbClient = database_1.default) {
        try {
            const users = await dbClient.user.findMany({
                include: {
                    staff: {
                        include: {
                            role: true,
                        },
                    },
                    student: true,
                },
            });
            return users;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { id, email, tenantId } = criteria;
            const result = await dbClient?.user?.findFirst({
                where: {
                    ...(id && { id: Number(id) }),
                    ...(tenantId && { tenantId }),
                    ...(email && { email }),
                },
                include: {
                    staff: {
                        include: {
                            role: true,
                        },
                    },
                    student: true,
                },
            });
            return result;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = UserReadProvider;
//# sourceMappingURL=UserRead.provider.js.map