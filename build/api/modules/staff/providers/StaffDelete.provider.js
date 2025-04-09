"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
class StaffDeleteProvider {
    async deleteOne(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const toDelete = await dbClient?.staff?.findFirst({
            where: criteria,
        });
        // if(!toDelete) throw new Error("Staff not found");
        if (!toDelete)
            throw new BadRequestError_1.BadRequestError(`Staff ${SystemMessages_1.NOT_FOUND}`, HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
        const deletedStaff = await dbClient?.staff?.delete({
            where: { id: toDelete.id },
        });
        return deletedStaff;
    }
    async deleteMany(criteria, tx) {
        const dbClient = tx ? tx : database_1.default;
        const deletedStaff = await dbClient?.staff?.deleteMany({
            where: criteria,
        });
        return deletedStaff;
    }
}
exports.default = StaffDeleteProvider;
//# sourceMappingURL=StaffDelete.provider.js.map