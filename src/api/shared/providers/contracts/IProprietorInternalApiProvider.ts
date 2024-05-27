import { User } from "@prisma/client"
import { CreateProprietorRecordDTO } from "~/api/modules/auth/types/AuthDTO"

export interface IProprietorInternalApiProvider {
  findProprietorByEmail(args: CreateProprietorRecordDTO): Promise<User | null>

  createProprietorRecord(
    args: CreateProprietorRecordDTO,
    dbClient: any
  ): Promise<User>
}
