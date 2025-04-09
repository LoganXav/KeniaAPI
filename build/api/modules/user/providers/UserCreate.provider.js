"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class UserCreateProvider {
    async create(args, dbClient = database_1.default) {
        const { tenantId, firstName, gender, bloodGroup, religion, dateOfBirth, lastName, password, phoneNumber, email, userType, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode } = args;
        try {
            const newUser = await dbClient?.user?.create({
                data: {
                    tenantId,
                    email,
                    firstName,
                    lastName,
                    gender,
                    bloodGroup,
                    religion,
                    dateOfBirth,
                    password,
                    phoneNumber,
                    userType,
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
            return newUser;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = UserCreateProvider;
//# sourceMappingURL=UserCreate.provider.js.map