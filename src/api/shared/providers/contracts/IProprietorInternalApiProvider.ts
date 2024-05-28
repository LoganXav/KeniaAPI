import { User } from "@prisma/client"
import { SignUpUserRecordDTO } from "~/api/modules/auth/types/AuthDTO"

export interface IProprietorInternalApiProvider {
  findProprietorByEmail(email: string, tx?: any): Promise<User | null>

  createProprietorRecord(args: SignUpUserRecordDTO, tx?: any): Promise<User>
}
