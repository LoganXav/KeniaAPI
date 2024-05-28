import { User } from "@prisma/client"
import {
  SignUpUserRecordDTO,
  UpdateUserAccountVerificationRecordDTO,
  UpdateUserFirstTimeLoginRecordDTO,
  updateUserLastLoginDateDTO
} from "~/api/modules/auth/types/AuthDTO"

export interface IProprietorInternalApiProvider {
  findProprietorByEmail(email: string, tx?: any): Promise<User | null>
  findProprietorById(id: number, tx?: any): Promise<User | null>
  createProprietorRecord(args: SignUpUserRecordDTO, tx?: any): Promise<User>
  updateUserAccountVerificationRecord(
    args: UpdateUserAccountVerificationRecordDTO,
    tx?: any
  ): Promise<User>
  updateUserFirstTimeLoginRecord(
    args: UpdateUserFirstTimeLoginRecordDTO,
    tx?: any
  ): Promise<User>
  updateUserLastLoginDate(
    args: updateUserLastLoginDateDTO,
    tx?: any
  ): Promise<User>
}
