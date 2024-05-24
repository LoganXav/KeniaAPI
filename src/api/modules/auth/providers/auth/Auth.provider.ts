import DbClient from "~/infrastructure/internal/database"
import { IAuthProvider } from "../contracts/IAuth.provider"
import { CreatePrincipalUserRecordDTO, User } from "../../types/AuthDTO"
import DateTimeUtil from "~/utils/DateTimeUtil"
import { UserRoleTypesEnum } from "../../types/UserRoleTypes.enum"

export default class AuthProvider implements IAuthProvider {
  public async createPrincipalUserRecord(
    args: CreatePrincipalUserRecordDTO
  ): Promise<User> {
    const { firstName, lastName, phoneNumber, email } = args
    const result = await DbClient.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
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
    console.log(args)
    const result = await DbClient.user.findUnique({
      where: { email: args.email },
      include: {
        principal: true
      }
    })
    console.log(result)

    return Promise.resolve(result)
  }

  public async createSchoolRecord(args: number) {
    const result = await DbClient.school.create({
      data: {
        createdAt: DateTimeUtil.getCurrentDate(),
        principalId: args
      }
    })

    return Promise.resolve(result)
  }
}
