import DbClient from "~/infrastructure/internal/database"
import { IAuthProvider } from "../contracts/IAuth.provider"
import { CreatePrincipalUserRecordDTO } from "../../types/AuthDTO"
import DateTimeUtil from "~/utils/DateTimeUtil"
import { UserRoleTypesEnum } from "../../types/UserRoleTypes.enum"
import { User } from "@prisma/client"

export default class AuthProvider implements IAuthProvider {
  public async createPrincipalUserRecord(
    args: CreatePrincipalUserRecordDTO,
    dbClient: any
  ): Promise<User> {
    const { firstName, lastName, password, phoneNumber, email } = args
    const result = await dbClient?.user?.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        phoneNumber: phoneNumber,
        role: UserRoleTypesEnum.PRINCIPAL,
        principal: {
          create: {}
        }
      },
      include: {
        principal: true
      }
    })

    return Promise.resolve(result)
  }

  public async findPrincipalUserByEmail(args: CreatePrincipalUserRecordDTO) {
    const result = await DbClient?.user?.findUnique({
      where: { email: args?.email },
      include: {
        principal: true
      }
    })

    return Promise.resolve(result)
  }

  public async createSchoolRecord(args: number, dbClient: any) {
    const result = await dbClient?.school?.create({
      data: {
        createdAt: DateTimeUtil.getCurrentDate(),
        principalId: args
      }
    })

    return Promise.resolve(result)
  }
}
