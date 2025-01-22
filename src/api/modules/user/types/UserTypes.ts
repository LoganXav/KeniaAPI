import { z } from "zod";
import { UserToken, UserType } from "@prisma/client";
import { verifyOtpTokenSchema } from "~/api/modules/auth/validators/VerifyOtpSchema";
import { refreshOtpTokenSchema } from "~/api/modules/auth/validators/RefreshOtpTokenSchema";
import { signUpUserRecordSchema } from "~/api/modules/auth/validators/SignUpUserRecordSchema";
import { signInUserRecordSchema } from "~/api/modules/auth/validators/SignInUserRecordSchema";
import { requestPasswordResetSchema } from "~/api/modules/auth/validators/RequestPasswordResetSchema";
import { confirmPasswordResetSchema } from "~/api/modules/auth/validators/ConfirmPasswordResetSchema";

export type SignUpUserType = z.infer<typeof signUpUserRecordSchema>;

export type CreateUserRecordType = SignUpUserType & {
  tenantId: number;
  userType: UserType;
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
  dateOfBirth?: Date;
  phoneNumber?: string;
  email?: string;
  isFirstTimeLogin?: boolean;
  hasVerified?: boolean;
  lastLoginDate?: Date;
  residentialAddress?: string;
  residentialCity?: string;
  residentialState?: string;
  residentialCountry?: string;
  residentialZipCode?: string;
};

export type ReadUserRecordType = {
  id?: number;
  email?: string;
};
