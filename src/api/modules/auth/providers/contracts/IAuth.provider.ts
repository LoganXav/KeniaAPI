import { RegisterPrincipalUserAccountDTO, User } from "../../types/authDTO"

export interface IAuthProvider {
  registerPrincipalUserAccount(
    args: RegisterPrincipalUserAccountDTO
  ): Promise<User>
}
