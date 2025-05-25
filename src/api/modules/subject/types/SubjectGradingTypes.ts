import { z } from "zod";
import { subjectGradingCreateRequestSchema } from "~/api/modules/subject/validators/SubjectGradingSchema";

export type SubjectGradingCreateRequestType = z.infer<typeof subjectGradingCreateRequestSchema>;
