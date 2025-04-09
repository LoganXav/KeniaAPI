"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
class RoleDeleteProvider {
    async deleteOne(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const toDelete = await dbClient?.role?.findFirst({
            where: criteria,
        });
        if (!toDelete)
            throw new BadRequestError_1.BadRequestError(`Role ${SystemMessages_1.NOT_FOUND}`, HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
        const deletedRole = await dbClient?.role?.delete({
            where: { id: toDelete.id },
        });
        return deletedRole;
    }
    async deleteMany(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const deletedRole = await dbClient?.role?.deleteMany({
            where: criteria,
        });
        return deletedRole;
    }
}
exports.default = RoleDeleteProvider;
//# sourceMappingURL=RoleDelete.provider.js.map