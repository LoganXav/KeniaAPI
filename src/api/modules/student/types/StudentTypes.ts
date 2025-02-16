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
  studentId?: string;
  enrollmentDate: Date;
  admissionNo?: string;
  currentGrade?: number;
  languages?: string;
  religion?: string;
  bloodGroup?: string;
  previousSchool?: string;
  isActive?: boolean;
}

export interface StudentCriteria {
  id?: number;
  studentId?: string;
  admissionNo?: string;
  classId?: number;
  userId?: number;
  tenantId?: number;
  isActive?: boolean;
}

export interface UpdateStudentData {
  classId?: number;
  admissionNo?: string;
  currentGrade?: number;
  languages?: string;
  religion?: string;
  bloodGroup?: string;
  previousSchool?: string;
  isActive?: boolean;
}

export interface GetAndUpdateStaff {
  criteria: StudentCriteria;
  data: UpdateStudentData;
  updateStatus?: boolean;
}
