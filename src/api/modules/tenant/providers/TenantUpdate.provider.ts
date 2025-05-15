import { Tenant, TenantMetadata } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@EnforceTenantId
export default class TenantUpdateProvider {
  public async updateMetadata(args: any, dbClient: PrismaTransactionClient = DbClient): Promise<TenantMetadata> {
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
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  public async updateOneByCriteria(args: any, dbClient: PrismaTransactionClient = DbClient): Promise<Tenant> {
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
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
