"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class TenantCreateProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const newTenant = await dbClient?.tenant?.create({
                data: {
                    metadata: {
                        create: {
                            totalStaff: 1,
                            totalStudents: 0,
                        },
                    },
                },
                include: {
                    metadata: true,
                },
            });
            return newTenant;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = TenantCreateProvider;
//# sourceMappingURL=TenantCreate.provider.js.map