import ServerConfig from "~/config/ServerConfig"

class AppSettings {
  ServiceName: string
  ServiceContext: string
  ServerRoot: string
  ServerPort: number
  ServerHost: string
  DefaultHealthRemoteService: string

  constructor(serverConfig: Record<string, any>) {
    this.ServerPort = serverConfig.Server.Port
    this.ServerHost = serverConfig.Server.Host
    this.ServerRoot = serverConfig.Server.Root
    this.ServiceName = serverConfig.Server.ServiceName
    this.ServiceContext = serverConfig.Server.ServiceContext.Context
    this.DefaultHealthRemoteService =
      serverConfig.Params.DefaultHealthRemoteService.Context
  }
}

export default new AppSettings(ServerConfig)

export class AppConstants {
  static readonly SHA512_ALGORITHM = "sha512"
  static readonly SHA256_ALGORITHM = "sha256"
  static readonly HS512_ALGORITHM = "HS512"
  static readonly BASE64_ENCODING = "base64"
  static readonly ASCII_ENCODING = "ascii"
}
