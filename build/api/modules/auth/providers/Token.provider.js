"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class TokenProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const { userId, tokenType, expiresAt, token } = args;
            const userToken = await dbClient.userToken.create({
                data: {
                    userId,
                    tokenType,
                    token,
                    expiresAt,
                },
            });
            return userToken;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
    async getOneByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { token } = criteria;
            const result = await dbClient?.userToken?.findFirst({
                where: {
                    ...(token && { token }),
                },
            });
            return result;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
    async getByCriteria(criteria, dbClient = database_1.default) {
        try {
            const { userId, tokenType } = criteria;
            const result = await dbClient?.userToken?.findMany({
                where: {
                    ...(userId && { id: userId }),
                    ...(tokenType && { tokenType }),
                },
            });
            return result;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
    async updateOneByCriteria(args, dbClient = database_1.default) {
        try {
            const { tokenId, isActive, expired } = args;
            const result = await dbClient?.userToken?.update({
                where: {
                    id: tokenId,
                },
                data: {
                    ...(isActive && { isActive }),
                    ...(expired && { expired }),
                },
            });
            return result;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = TokenProvider;
//# sourceMappingURL=Token.provider.js.map