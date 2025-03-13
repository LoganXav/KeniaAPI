import { z } from "zod";
import { termCreateSchema } from "../../term/validators/TermCreateSchema";

export const totalSchoolCalendarCreateSchema = z.object({
  id: z.number().optional(),
  year: z.number(),
  tenantId: z.number(),
  terms: z.array(termCreateSchema).optional(),
});
