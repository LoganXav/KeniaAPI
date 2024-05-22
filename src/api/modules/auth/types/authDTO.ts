import { z } from "zod"
import { userRegistrationSchema } from "../validators/userRegistrationSchema"

export type RegisterPrincipalUserAccountDTO = z.infer<
  typeof userRegistrationSchema
>

export interface User {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
}
