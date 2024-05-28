import { z } from "zod"

import { createProprietorRecordSchema } from "../validators/ProprietorRecordCreationSchema"
import { UserToken } from "@prisma/client"

export type CreateProprietorRecordDTO = z.infer<
  typeof createProprietorRecordSchema
>

export type CreateUserTokenRecordDTO = Omit<UserToken, "id">
