"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../../infrastructure/internal/database"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
class TenantUpdateProvider {
    async updateMetadata(args, dbClient = database_1.default) {
        const { tenantId, staff, student } = args;
        try {
            const newTenantMetadata = await dbClient?.tenantMetadata?.update({
                where: { tenantId },
                data: {
                    ...(staff && { totalStaff: { increment: 1 } }),
                    ...(student && { totalStudents: { increment: 1 } }),
                },
            });
            return newTenantMetadata;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
    async updateOneByCriteria(args, dbClient = database_1.default) {
        try {
            const { tenantId, onboardingStatus, name, registrationNo, contactEmail, contactPhone, establishedDate, logoUrl, address, stateId, lgaId, countryId, zipCode, postalCode } = args;
            const updatedTenant = await dbClient?.tenant?.update({
                where: { id: tenantId },
                data: {
                    ...(onboardingStatus && { onboardingStatus }),
                    ...(name && { name }),
                    ...(registrationNo && { registrationNo }),
                    ...(contactEmail && { contactEmail }),
                    ...(contactPhone && { contactPhone }),
                    ...(establishedDate && { establishedDate }),
                    ...(logoUrl && { logoUrl }),
                    ...(address && { address }),
                    ...(stateId && { stateId }),
                    ...(lgaId && { lgaId }),
                    ...(countryId && { countryId }),
                    ...(zipCode && { zipCode }),
                    ...(postalCode && { postalCode }),
                },
            });
            return updatedTenant;
        }
        catch (error) {
            throw new InternalServerError_1.InternalServerError(error.message);
        }
    }
}
exports.default = TenantUpdateProvider;
//# sourceMappingURL=TenantUpdate.provider.js.map