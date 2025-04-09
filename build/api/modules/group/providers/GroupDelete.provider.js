"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
class GroupDeleteProvider {
    async deleteOne(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const toDelete = await dbClient?.group?.findFirst({
            where: criteria,
        });
        if (!toDelete)
            throw new BadRequestError_1.BadRequestError(`Group ${SystemMessages_1.NOT_FOUND}`, HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
        const deletedGroup = await dbClient?.group?.delete({
            where: { id: toDelete.id },
        });
        return deletedGroup;
    }
    async deleteMany(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const deletedGroup = await dbClient?.group?.deleteMany({
            where: criteria,
        });
        return deletedGroup;
    }
}
exports.default = GroupDeleteProvider;
//# sourceMappingURL=GroupDelete.provider.js.map