import { CreateUserDTO, User } from "../../types/userDTO"

export interface IAuthProvider {
  createUser(args: CreateUserDTO): Promise<User>
}
