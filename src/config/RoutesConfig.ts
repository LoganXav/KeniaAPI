import ServerConfig from "./ServerConfig"

const root = ServerConfig.Server.Root

// Add all the white listed routes in the application
export const ROUTE_WHITE_LIST = [`${root}/ping`, `${root}/v1/auth/login`]

// Add all the protected routes in the application
export const ROUTE_PROTECTED = [`${root}/v1/dashboard`]
