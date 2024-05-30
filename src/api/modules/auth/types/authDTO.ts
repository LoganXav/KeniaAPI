import { z } from "zod"

import { TokenType, UserToken } from "@prisma/client"
import { verifyOtpTokenSchema } from "../validators/VerifyOtpSchema"
import { refreshOtpTokenSchema } from "../validators/RefreshOtpTokenSchema"
import { signUpUserRecordSchema } from "../validators/SignUpUserRecordSchema"
import { signInUserRecordSchema } from "../validators/SignInUserRecordSchema"
import { confirmPasswordResetSchema } from "../validators/ConfirmPasswordResetSchema"
import { requestPasswordResetSchema } from "../validators/RequestPasswordResetSchema"

export type SignUpUserRecordDTO = z.infer<typeof signUpUserRecordSchema>
export type SignInUserRecordDTO = z.infer<typeof signInUserRecordSchema>
export type CreateUserTokenRecordDTO = Omit<
  UserToken,
  "id" | "isActive" | "expired"
>
export type RefreshUserTokenDTO = z.infer<typeof refreshOtpTokenSchema>
export type VerifyUserTokenDTO = z.infer<typeof verifyOtpTokenSchema>
export type RequestPasswordResetDTO = z.infer<typeof requestPasswordResetSchema>
export type ConfirmPasswordResetDTO = z.infer<typeof confirmPasswordResetSchema>

export type UpdateUserTokenActivationRecordDTO = {
  tokenId: number
  expired: boolean
  isActive: boolean
}

export type FindActiveUserTokenByTypeDTO = {
  userId: number
  tokenType: TokenType
  expired: boolean
  isActive: boolean
}

export type UpdateUserAccountVerificationRecordDTO = {
  userId: number
  hasVerified: boolean
}

export type UpdateUserFirstTimeLoginRecordDTO = {
  userId: number
  isFirstTimeLogin: boolean
}
export type updateUserLastLoginDateDTO = {
  userId: number
  lastLoginDate: Date
}

export type updateUserPasswordDTO = {
  userId: number
  password: string
}
