import { z } from "zod";
import { subjectGradingStructureReadSchema } from "~/api/modules/subject/validators/SubjectGradingStructureReadSchema";
import { subjectGradingStructureCreateSchema } from "~/api/modules/subject/validators/SubjectGradingStructureCreateSchema";

export type SubjectGradingStructureCreateRequestType = z.infer<typeof subjectGradingStructureCreateSchema>;
export type SubjectGradingStructureReadRequestType = z.infer<typeof subjectGradingStructureReadSchema>;

export type SubjectGradingStructureCriteriaType = {
  id?: number;
  ids?: number[];
  subjectId?: number;
  tenantId?: number;
  staffId?: number;
  tenantGradingStructureId?: number;
};
