import { autoInjectable } from "tsyringe"
import DbClient from "~/infrastructure/internal/database"
import { IAuthProvider } from "../contracts/IAuth.provider"
import { CreateUserDTO, User } from "../../types/userDTO"

@autoInjectable()
export default class AuthProvider implements IAuthProvider {
  public async createUser(args: CreateUserDTO): Promise<User> {
    const { name, email } = args
    const result = await DbClient.user.create({
      data: {
        name,
        email,
        posts: {
          create: []
        }
      }
    })

    return Promise.resolve(result)
  }
}
