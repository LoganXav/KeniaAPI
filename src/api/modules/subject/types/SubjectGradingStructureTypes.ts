import { z } from "zod";
import { subjectGradingStructureCreateSchema } from "~/api/modules/subject/validators/SubjectGradingStructureCreateSchema";

export type SubjectGradingStructureCreateRequestType = z.infer<typeof subjectGradingStructureCreateSchema>;
