import ServerConfig from "~/config/ServerConfig";
import bcrypt from "bcryptjs";
export class PasswordEncryptionService {
  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, ServerConfig.Params.Security.Bcrypt.SaltRounds);
  }

  public static async verifyPassword(candidatePassword: string, hashedPassword: string) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}
