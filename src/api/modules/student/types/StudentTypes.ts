import { z } from "zod";
import { ClassList, Prisma, Status, User } from "@prisma/client";
import { userObjectWithoutPassword } from "~/api/shared/helpers/objects";
import { studentUpdateSchema, studentUpdateManySchema } from "~/api/modules/student/validators/StudentUpdateSchema";
import { studentCreateRequestSchema, studentCriteriaSchema } from "~/api/modules/student/validators/StudentCreateSchema";
import { studentSubjectRegistrationCreateRequestSchema } from "~/api/modules/student/validators/StudentSubjectRegistrationCreateRequestSchema";

export type StudentCriteriaType = z.infer<typeof studentCriteriaSchema>;
export type StudentUpdateRequestType = z.infer<typeof studentUpdateSchema>;
export type StudentCreateRequestType = z.infer<typeof studentCreateRequestSchema>;
export type StudentUpdateManyRequestType = z.infer<typeof studentUpdateManySchema>;
export type StudentSubjectRegistrationCreateRequestType = z.infer<typeof studentSubjectRegistrationCreateRequestSchema>;

export interface StudentCreateType {
  userId: number;
  classId: number;
  tenantId: number;
  admissionNo: string;
  dormitoryId?: number;
  guardianIds?: number[];
  classDivisionId: number;
  enrollmentDate?: string;
  studentGroupIds?: number[];
}

export interface StudentBulkCreateType {
  tenantId: number;
  userId: number;
  classId: number;
  classDivisionId: number;
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

export interface StudentSubjectRegistrationReadType {
  status: Status;
  classId: number;
  tenantId: number;
  subjectId?: number;
  studentId?: number;
  calendarId: number;
  classDivisionId?: number;
}

export interface StudentSubjectRegistrationDeleteType {
  studentId: number;
  subjectId: number;
  calendarId: number;
  tenantId: number;
}

export interface StudentSubjectRegistrationUpdateType {
  status: Status;
  tenantId: number;
  studentId: number;
  calendarId: number;
}

export interface StudentTermResultCreateType {
  termId: number;
  tenantId: number;
  studentId: number;
  totalScore?: number;
  finalized?: boolean;
  averageScore?: number;
  classId: number;
  subjectCountGraded?: number;
  classDivisionId: number;
}

export interface StudentTermResultUpdateType {
  studentId: number;
  termId: number;
  tenantId: number;
  totalScore?: number;
  averageScore?: number;
  subjectCountGraded?: number;
  finalized?: boolean;
}

export interface StudentTermResultReadType {
  termId?: number;
  classId?: number;
  tenantId?: number;
  studentId?: number;
  classDivisionId?: number;
}

export interface StudentCalendarResultCreateType {
  calendarId: number;
  tenantId: number;
  studentId: number;
  totalScore?: number;
  finalized?: boolean;
  averageScore?: number;
  classId: number;
  subjectCountGraded?: number;
  classDivisionId: number;
  finalizedTermResultsCount?: number;
}

export interface StudentCalendarResultUpdateType {
  studentId: number;
  calendarId: number;
  tenantId: number;
  totalScore?: number;
  averageScore?: number;
  subjectCountGraded?: number;
  finalized?: boolean;
}

export interface StudentCalendarResultReadType {
  calendarId: number;
  classId?: number;
  tenantId?: number;
  studentId?: number;
  classDivisionId?: number;
}
