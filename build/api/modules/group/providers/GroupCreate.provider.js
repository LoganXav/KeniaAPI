"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const BadRequestError_1 = require("../../../../infrastructure/internal/exceptions/BadRequestError");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
class GroupCreateProvider {
    async createGroup(data, tx) {
        try {
            const dbClient = tx ? tx : database_1.default;
            const newGroup = await dbClient?.group?.create({
                data: {
                    name: data.name,
                    tenantId: data.tenantId,
                },
            });
            return newGroup;
        }
        catch (error) {
            throw new BadRequestError_1.BadRequestError(`${error}`, HttpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND);
        }
    }
}
exports.default = GroupCreateProvider;
//# sourceMappingURL=GroupCreate.provider.js.map