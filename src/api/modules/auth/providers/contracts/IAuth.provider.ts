import { CreatePrincipalUserRecordDTO, User } from "../../types/AuthDTO"

export interface IAuthProvider {
  createPrincipalUserRecord(args: CreatePrincipalUserRecordDTO): Promise<User>
  createSchoolRecord(args: number): Promise<{
    id: number
    createdAt: Date
    updatedAt: Date | null
    title: string | null
    country: string | null
    state: string | null
    lga: string | null
    principalId: number
  }>
}
