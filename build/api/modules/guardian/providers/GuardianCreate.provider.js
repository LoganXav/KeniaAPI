"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class GuardianCreateProvider {
    async create(args, dbClient = database_1.default) {
        try {
            const { firstName, lastName, phoneNumber, email, gender, dateOfBirth, residentialAddress, residentialStateId, residentialLgaId, residentialCountryId, residentialZipCode, tenantId, studentIds } = args;
            const guardian = await dbClient.guardian.create({
                data: {
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    gender,
                    dateOfBirth,
                    residentialAddress,
                    residentialStateId,
                    residentialLgaId,
                    residentialCountryId,
                    residentialZipCode,
                    tenantId,
                    students: {
                        connect: studentIds?.map((id) => ({ id })),
                    },
                },
                include: {
                    students: true,
                },
            });
            return guardian;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
    async createMany(args, dbClient = database_1.default) {
        try {
            const data = args.map((guardian) => ({
                tenantId: guardian.tenantId,
                email: guardian.email,
                gender: guardian.gender,
                lastName: guardian.lastName,
                firstName: guardian.firstName,
                phoneNumber: guardian.phoneNumber,
                dateOfBirth: guardian.dateOfBirth,
                residentialLgaId: guardian.residentialLgaId,
                residentialAddress: guardian.residentialAddress,
                residentialStateId: guardian.residentialStateId,
                residentialZipCode: guardian.residentialZipCode,
                residentialCountryId: guardian.residentialCountryId,
            }));
            await dbClient.guardian.createMany({
                data,
                skipDuplicates: true,
            });
            const createdGuardians = await dbClient.guardian.findMany({
                where: {
                    email: { in: args.map((guardian) => guardian.email) },
                    tenantId: args[0].tenantId,
                },
                select: { id: true },
            });
            return createdGuardians;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error);
        }
    }
}
exports.default = GuardianCreateProvider;
//# sourceMappingURL=GuardianCreate.provider.js.map