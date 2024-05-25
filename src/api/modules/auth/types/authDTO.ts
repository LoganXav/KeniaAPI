import { z } from "zod"
import { userRegistrationSchema } from "../validators/userRegistrationSchema"
import { UserTokenTypesEnum } from "@prisma/client"

export type CreatePrincipalUserRecordDTO = z.infer<
  typeof userRegistrationSchema
>

export type CreateUserTokenDTO = {
  userId: number
  token: string
  tokenType: UserTokenTypesEnum
  expiresOn: Date
}
