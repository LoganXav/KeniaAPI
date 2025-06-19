import { z } from "zod";
import { ClassList, Prisma, Subject, User } from "@prisma/client";
import { studentUpdateSchema, studentUpdateManySchema } from "../validators/StudentUpdateSchema";
import { studentCreateRequestSchema, studentCriteriaSchema } from "../validators/StudentCreateSchema";
import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";

export type StudentCreateRequestType = z.infer<typeof studentCreateRequestSchema>;
export type StudentCriteriaType = z.infer<typeof studentCriteriaSchema>;
export type StudentUpdateRequestType = z.infer<typeof studentUpdateSchema>;
export type StudentUpdateManyRequestType = z.infer<typeof studentUpdateManySchema>;

export interface StudentCreateType {
  userId: number;
  tenantId: number;
  classId: number;
  classDivisionId: number;
  enrollmentDate?: string;
  admissionNo?: string;
  studentGroupIds?: number[];
  dormitoryId?: number;
  guardianIds?: number[];
}

export type StudentWithRelationsType = {
  id: number;
  userId: number;
  classId: number | null;
  classDivisionId: number | null;
  class: {
    id: number;
    name: ClassList | null;
    tenantId: number;
  } | null;
  classDivision: {
    id: number;
    name: string;
  } | null;
  dormitory: {
    id: number;
    name: string;
  } | null;
  guardians: {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string | null;
    gender: string | null;
    dateOfBirth: Date | null;
    residentialAddress: string | null;
    residentialStateId: number | null;
    residentialLgaId: number | null;
    residentialCountryId: number | null;
    residentialZipCode: number | null;
    tenantId: number;
  }[];
  studentGroups: {
    id: number;
    name: string;
  }[];
  subjectsRegistered: {
    subject: {
      id: number;
      name: string;
      description: string | null;
    };
  }[];
  user: Omit<User, "password">;
};

export type StudentWithRelationsSafeUser = Prisma.StudentGetPayload<{
  include: {
    user: {
      select: typeof userObjectWithoutPassword;
    };
    class: true;
    guardians: true;
    documents: true;
    dormitory: true;
    classDivision: true;
    medicalHistory: true;
    studentGroups: true;
    subjectsRegistered: {
      include: {
        subject: true;
      };
    };
  };
}>;

export interface StudentCriteria {
  id?: number;
  admissionNo?: string;
  classId?: number;
  userId?: number;
  tenantId?: number;
  dormitoryId?: number;
  guardianIds?: number[];
}

export interface StudentSubjectRegistrationCreateType {
  studentId: number;
  subjectId: number;
  calendarId: number;
  classId: number;
  classDivisionId?: number;
  tenantId: number;
}

export interface StudentSubjectRegistrationDeleteType {
  studentId: number;
  subjectId: number;
  calendarId: number;
  tenantId: number;
}
