"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class RoleCreateProvider {
    async createRole(data, dbClient = database_1.default) {
        try {
            const { tenantId, name, rank, permissions } = data;
            const newRole = await dbClient?.role?.create({
                data: {
                    name,
                    rank,
                    permissions: {
                        connect: permissions.map((permission) => ({ id: permission.id })),
                    },
                    tenantId,
                },
            });
            return newRole;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = RoleCreateProvider;
//# sourceMappingURL=RoleCreate.provider.js.map