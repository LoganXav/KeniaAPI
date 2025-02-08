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
  classId: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  admissionNo?: string;
  enrollmentDate?: Date;
}

export interface StudentCriteria {
  id?: number;
  dob?: string;
  address?: string;
  enrollmentDate?: string;
  classId?: number;
  tenantId?: number;
}

export interface UpdateStudentData {
  dob?: string;
  address?: string;
  enrollmentDate?: string;
  classId?: number;
  tenantId?: number;
}

export interface GetAndUpdateStaff {
  criteria: StudentCriteria;
  data: UpdateStudentData;
  updateStatus?: boolean;
}
