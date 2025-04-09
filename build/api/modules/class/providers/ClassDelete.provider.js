"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
class ClassDeleteProvider {
    async deleteOne(args, dbClient = database_1.default) {
        const toDelete = await dbClient?.class?.findFirst({
            where: { id: args.id },
        });
        if (!toDelete)
            throw new BadRequestError_1.BadRequestError(`Class ${SystemMessages_1.NOT_FOUND}`, HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
        const deletedClass = await dbClient?.class?.delete({
            where: { id: toDelete.id },
        });
        return deletedClass;
    }
}
exports.default = ClassDeleteProvider;
//# sourceMappingURL=ClassDelete.provider.js.map