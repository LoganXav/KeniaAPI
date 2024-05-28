import { z } from "zod"

import { UserToken } from "@prisma/client"
import { verifyOtpTokenSchema } from "../validators/VerifyOtpSchema"
import { refreshOtpTokenSchema } from "../validators/RefreshOtpTokenSchema"
import { signUpUserRecordSchema } from "../validators/SignUpUserRecordSchema"
import { signInUserRecordSchema } from "../validators/SignInUserRecordSchema"
import { DateTime } from "luxon"

export type SignUpUserRecordDTO = z.infer<typeof signUpUserRecordSchema>

export type SignInUserRecordDTO = z.infer<typeof signInUserRecordSchema>

export type CreateUserTokenRecordDTO = Omit<
  UserToken,
  "id" | "isActive" | "expired"
>

export type UpdateUserTokenRecordDTO = {
  tokenId: number
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

export type RefreshUserTokenDTO = z.infer<typeof refreshOtpTokenSchema>
export type VerifyUserTokenDTO = z.infer<typeof verifyOtpTokenSchema>
