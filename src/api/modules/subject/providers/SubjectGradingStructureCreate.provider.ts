import { SubjectGradingStructure } from "@prisma/client";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { EnforceTenantId } from "~/api/modules/base/decorators/EnforceTenantId.decorator";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { SubjectGradingStructureCreateRequestType } from "~/api/modules/subject/types/SubjectGradingStructureTypes";

@EnforceTenantId
export default class SubjectGradingStructureCreateProvider {
  public async createOrUpdate(args: SubjectGradingStructureCreateRequestType, dbClient: PrismaTransactionClient = DbClient): Promise<SubjectGradingStructure> {
    try {
      const { id, subjectId, tenantGradingStructureId, continuousAssessmentBreakdownItems, tenantId, staffId } = args;

      const subjectGradingStructure = await dbClient.subjectGradingStructure.upsert({
        where: { id: id || 0 },
        update: {
          // We use the connect clause becaue these fields are mandatory in the db schema
          subject: { connect: { id: subjectId } },
          staff: { connect: { id: staffId } },
          tenantGradingStructure: { connect: { id: tenantGradingStructureId } },
          tenant: { connect: { id: tenantId } },
          continuousAssessmentBreakdownItems: {
            create: continuousAssessmentBreakdownItems.map((item) => ({
              name: item.name,
              weight: item.weight,
            })),
          },
        },
        create: {
          subject: { connect: { id: subjectId } },
          staff: { connect: { id: staffId } },
          tenantGradingStructure: { connect: { id: tenantGradingStructureId } },
          tenant: { connect: { id: tenantId } },
          continuousAssessmentBreakdownItems: {
            create: continuousAssessmentBreakdownItems.map((item) => ({
              name: item.name,
              weight: item.weight,
            })),
          },
        },
      });

      return subjectGradingStructure;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
