"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class UserUpdateProvider {
    async updateOneByCriteria(args, dbClient = database_1.default) {
        const { userId, firstName, gender, lastName, dateOfBirth, phoneNumber, religion, bloodGroup, hasVerified, isFirstTimeLogin, lastLoginDate, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode } = args;
        try {
            const result = await dbClient?.user?.update({
                where: {
                    id: userId,
                },
                data: {
                    ...(firstName && { firstName }),
                    ...(lastName && { lastName }),
                    ...(gender && { gender }),
                    ...(dateOfBirth && { dateOfBirth }),
                    ...(phoneNumber && { phoneNumber }),
                    ...(religion && { religion }),
                    ...(bloodGroup && { bloodGroup }),
                    ...(hasVerified !== undefined && { hasVerified }),
                    ...(isFirstTimeLogin !== undefined && { isFirstTimeLogin }),
                    ...(lastLoginDate && { lastLoginDate }),
                    ...(residentialAddress && { residentialAddress }),
                    ...(residentialStateId && { residentialStateId }),
                    ...(residentialLgaId && { residentialLgaId }),
                    ...(residentialCountryId && { residentialCountryId }),
                    ...(residentialZipCode && { residentialZipCode }),
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
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = UserUpdateProvider;
//# sourceMappingURL=UserUpdate.provider.js.map