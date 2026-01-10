import { z } from "zod";
import { verifyOtpTokenSchema } from "~/api/modules/auth/validators/VerifyOtpSchema";
import { refreshOtpTokenSchema } from "~/api/modules/auth/validators/RefreshOtpTokenSchema";
import { Permission, Role, Staff, Student, User, UserToken, UserType } from "@prisma/client";
import { signUpUserRecordSchema } from "~/api/modules/auth/validators/SignUpUserRecordSchema";
import { signInUserRecordSchema } from "~/api/modules/auth/validators/SignInUserRecordSchema";
import { requestPasswordResetSchema } from "~/api/modules/auth/validators/RequestPasswordResetSchema";
import { confirmPasswordResetSchema } from "~/api/modules/auth/validators/ConfirmPasswordResetSchema";

export type SignUpUserType = z.infer<typeof signUpUserRecordSchema>;

export type CreateUserRecordType = {
  tenantId: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber?: string;
  userType: UserType;
  gender?: string;
  bloodGroup?: string;
  religion?: string;
  dateOfBirth?: string | null;
  residentialAddress?: string;
  residentialStateId?: number;
  residentialLgaId?: number;
  residentialCountryId?: number;
  residentialZipCode?: number;
};

export type CreateBulkUserRecordType = {
  firstName: string;
  lastName: string;
  tenantId: number;
  userType?: UserType;
  gender?: string;
  email: string;
  password: string;
  phoneNumber?: string;
};

export type SignInUserType = z.infer<typeof signInUserRecordSchema>;
export type CreateUserTokenRecordType = Omit<UserToken, "id" | "isActive" | "expired" | "tenantId">;
export type RefreshUserTokenType = z.infer<typeof refreshOtpTokenSchema>;
export type VerifyUserTokenType = z.infer<typeof verifyOtpTokenSchema>;
export type RequestUserPasswordResetType = z.infer<typeof requestPasswordResetSchema>;
export type ConfirmUserPasswordResetType = z.infer<typeof confirmPasswordResetSchema>;

export type UpdateUserRecordType = {
  userId: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | null;
  gender?: string;
  bloodGroup?: string;
  religion?: string;
  phoneNumber?: string;
  email?: string;
  isFirstTimeLogin?: boolean;
  hasVerified?: boolean;
  lastLoginDate?: Date;
  residentialAddress?: string;
  residentialStateId?: number;
  residentialLgaId?: number;
  residentialCountryId?: number;
  residentialZipCode?: number;
};

export type ReadUserRecordType = {
  id?: number;
  tenantId?: number;
  userId?: number;
  email?: string;
  emails?: string[];
};

export interface UserWithRelations extends User {
  staff: (Staff & { role: Role | null }) | null;
  student: Student | null;
}

export interface UserWithRelationsAndPermissions extends User {
  staff: (Staff & { role: (Role & { permissions: Permission[] }) | null; subjects : Subject[] | null; }) | null; // added the subjects entity just in case 
  student: Student | null;
}
