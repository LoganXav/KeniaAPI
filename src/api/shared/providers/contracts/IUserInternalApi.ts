import { User } from "@prisma/client"
import {
  CreateUserRecordType,
  UpdateUserAccountVerificationRecordType,
  UpdateUserFirstTimeLoginRecordType,
  UpdateUserLastLoginDateType,
  UpdateUserPasswordType
} from "../../types/UserInternalApiTypes"

export interface IUserInternalApiProvider {
  findUserByEmail(email: string, tx?: any): Promise<User | null>
  findUserById(id: number, tx?: any): Promise<User | null>
  createUserRecord(args: CreateUserRecordType, tx?: any): Promise<User>
  updateUserAccountVerificationRecord(
    args: UpdateUserAccountVerificationRecordType,
    tx?: any
  ): Promise<User>
  updateUserFirstTimeLoginRecord(
    args: UpdateUserFirstTimeLoginRecordType,
    tx?: any
  ): Promise<User>
  updateUserLastLoginDate(
    args: UpdateUserLastLoginDateType,
    tx?: any
  ): Promise<User>
  updateUserPassword(args: UpdateUserPasswordType, tx?: any): Promise<User>
}
