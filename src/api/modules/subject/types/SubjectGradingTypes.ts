import { z } from "zod";
import { Student } from "@prisma/client";
import { subjectGradingCreateRequestSchema } from "~/api/modules/subject/validators/SubjectGradingSchema";

export type SubjectGradingCreateRequestType = z.infer<typeof subjectGradingCreateRequestSchema> & { grade: string; remark: string; totalScore: number; totalContinuousScore: number; student: Student };
