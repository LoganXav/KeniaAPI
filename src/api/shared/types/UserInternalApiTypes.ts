import { z } from "zod"
import { TokenType, UserToken } from "@prisma/client"
import { signUpUserRecordSchema } from "~/api/modules/auth/validators/SignUpUserRecordSchema"
import { signInUserRecordSchema } from "~/api/modules/auth/validators/SignInUserRecordSchema"
import { refreshOtpTokenSchema } from "~/api/modules/auth/validators/RefreshOtpTokenSchema"
import { verifyOtpTokenSchema } from "~/api/modules/auth/validators/VerifyOtpSchema"
import { requestPasswordResetSchema } from "~/api/modules/auth/validators/RequestPasswordResetSchema"
import { confirmPasswordResetSchema } from "~/api/modules/auth/validators/ConfirmPasswordResetSchema"

export type SignUpUserType = z.infer<typeof signUpUserRecordSchema>

export type CreateUserRecordType = SignUpUserType & {
  tenantId: number
}

export type SignInUserType = z.infer<typeof signInUserRecordSchema>
export type CreateUserTokenRecordType = Omit<
  UserToken,
  "id" | "isActive" | "expired"
>
export type RefreshUserTokenType = z.infer<typeof refreshOtpTokenSchema>
export type VerifyUserTokenType = z.infer<typeof verifyOtpTokenSchema>
export type RequestUserPasswordResetType = z.infer<
  typeof requestPasswordResetSchema
>
export type ConfirmUserPasswordResetType = z.infer<
  typeof confirmPasswordResetSchema
>

export type UpdateUserTokenActivationRecordType = {
  tokenId: number
  expired: boolean
  isActive: boolean
}

export type FindUserActiveTokenByTypeType = {
  userId: number
  tokenType: TokenType
  expired: boolean
  isActive: boolean
}

export type UpdateUserAccountVerificationRecordType = {
  userId: number
  hasVerified: boolean
}

export type UpdateUserFirstTimeLoginRecordType = {
  userId: number
  isFirstTimeLogin: boolean
}
export type UpdateUserLastLoginDateType = {
  userId: number
  lastLoginDate: Date
}

export type UpdateUserPasswordType = {
  userId: number
  password: string
}
