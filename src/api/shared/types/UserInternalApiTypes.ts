import { z } from "zod";
import { UserToken } from "@prisma/client";
import { verifyOtpTokenSchema } from "~/api/modules/auth/validators/VerifyOtpSchema";
import { refreshOtpTokenSchema } from "~/api/modules/auth/validators/RefreshOtpTokenSchema";
import { signUpUserRecordSchema } from "~/api/modules/auth/validators/SignUpUserRecordSchema";
import { signInUserRecordSchema } from "~/api/modules/auth/validators/SignInUserRecordSchema";
import { requestPasswordResetSchema } from "~/api/modules/auth/validators/RequestPasswordResetSchema";
import { confirmPasswordResetSchema } from "~/api/modules/auth/validators/ConfirmPasswordResetSchema";

export type SignUpUserType = z.infer<typeof signUpUserRecordSchema>;

export type CreateUserRecordType = SignUpUserType & {
  tenantId: number;
};

export type SignInUserType = z.infer<typeof signInUserRecordSchema>;
export type CreateUserTokenRecordType = Omit<UserToken, "id" | "isActive" | "expired">;
export type RefreshUserTokenType = z.infer<typeof refreshOtpTokenSchema>;
export type VerifyUserTokenType = z.infer<typeof verifyOtpTokenSchema>;
export type RequestUserPasswordResetType = z.infer<typeof requestPasswordResetSchema>;
export type ConfirmUserPasswordResetType = z.infer<typeof confirmPasswordResetSchema>;

export type UpdateUserRecordType = {
  userId: number;
  isFirstTimeLogin?: boolean;
  hasVerified?: boolean;
  lastLoginDate?: Date;
};

export type ReadUserRecordType = {
  id?: number;
  email?: string;
};
