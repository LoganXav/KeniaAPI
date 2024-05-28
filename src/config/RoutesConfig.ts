import ServerConfig from "./ServerConfig"

const root = ServerConfig.Server.Root

// Add all the white listed routes in the application
export const ROUTE_WHITE_LIST = [
  `${root}/ping`,
  `${root}/auth/signin`,
  `${root}/auth/signup`,
  `${root}/auth/otp/refresh`
]
