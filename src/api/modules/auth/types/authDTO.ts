import { z } from "zod"

import { createProprietorRecordSchema } from "../validators/ProprietorRecordCreationSchema"
import { UserToken } from "@prisma/client"
import { verifyOtpTokenSchema } from "../validators/VerifyOtpSchema"
import { refreshOtpTokenSchema } from "../validators/RefreshOtpTokenSchema"

export type CreateProprietorRecordDTO = z.infer<
  typeof createProprietorRecordSchema
>

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

export type RefreshUserTokenDTO = z.infer<typeof refreshOtpTokenSchema>
export type VerifyUserTokenDTO = z.infer<typeof verifyOtpTokenSchema>
