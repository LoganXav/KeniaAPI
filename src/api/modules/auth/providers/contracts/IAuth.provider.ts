import { School, User } from "@prisma/client"
import { CreatePrincipalUserRecordDTO } from "../../types/AuthDTO"

export interface IAuthProvider {
  createPrincipalUserRecord(
    args: CreatePrincipalUserRecordDTO,
    dbClient: any
  ): Promise<User>
  createSchoolRecord(args: number, dbClient: any): Promise<School>
}
