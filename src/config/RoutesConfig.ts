import ServerConfig from "./ServerConfig";

const root = ServerConfig.Server.Root;

// Add all the white listed routes in the application
export const ROUTE_WHITE_LIST = [
  `${root}/ping`,
  `/api/docs/`,
  `${root}/auth/signin`,
  `${root}/auth/signup`,
  `${root}/auth/otp/refresh`,
  `${root}/auth/otp/verify`,
  `${root}/auth/password-reset/request`,
  `${root}/auth/password-reset/:token`,
  `${root}/staff`,
  `${root}/staff/all`,
  `${root}/staff/create`,
];
