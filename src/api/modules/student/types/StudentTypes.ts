import { z } from "zod";
import { studentCreateRequestSchema, studentCriteriaSchema } from "../validators/StudentCreateSchema";
import { studentUpdateSchema, studentUpdateManySchema } from "../validators/StudentUpdateSchema";

export type StudentCreateRequestType = z.infer<typeof studentCreateRequestSchema>;
export type StudentCriteriaType = z.infer<typeof studentCriteriaSchema>;
export type StudentUpdateRequestType = z.infer<typeof studentUpdateSchema>;
export type StudentUpdateManyRequestType = z.infer<typeof studentUpdateManySchema>;

export interface StudentCreateType {
  userId: number;
  tenantId: number;
  classId?: number;
  classDivisionId?: number;
  enrollmentDate: Date;
  admissionNo?: string;
  studentGroupIds?: number[];
  dormitoryId?: number;
  guardianIds?: number[];
}

export interface StudentCriteria {
  id?: number;
  admissionNo?: string;
  classId?: number;
  userId?: number;
  tenantId?: number;
  dormitoryId?: number;
  guardianIds?: number[];
}
