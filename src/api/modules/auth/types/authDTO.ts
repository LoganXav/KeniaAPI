import { z } from "zod"

import { createProprietorRecordSchema } from "../validators/ProprietorRecordCreationSchema"
import { TokenType } from "@prisma/client"

export type CreateProprietorRecordDTO = z.infer<
  typeof createProprietorRecordSchema
>
