// import { Server } from "http";
// import request from "supertest";
// import { container } from "tsyringe";
// import { PrismaClient } from "@prisma/client";
// import TokenProvider from "../providers/Token.provider";
// import AuthPasswordResetService from "../services/AuthPasswordReset.service";
// import { Application } from "../../../../infrastructure/internal/application";
// import UserReadProvider from "../../../modules/user/providers/UserRead.provider";
// import UserUpdateProvider from "../../../modules/user/providers/UserUpdate.provider";
// import AuthPasswordResetController from "../controllers/AuthPasswordReset.controller";
// import { HttpStatusCodeEnum } from "../../../shared/helpers/enums/HttpStatusCode.enum";
// import AuthPasswordResetRequestService from "../services/AuthPasswordResetRequest.service";
// import { ERROR, ERROR_INVALID_TOKEN, PASSWORD_RESET_LINK_GENERATED, SUCCESS } from "../../../shared/helpers/messages/SystemMessages";

// describe("Auth Password Reset Controller", () => {
//   let server: Server;
//   let app: Application;
//   let authPasswordResetRequestService: AuthPasswordResetRequestService;
//   let authPasswordResetService: AuthPasswordResetService;

//   beforeAll(async () => {
//     container.clearInstances();

//     const tokenProvider = new TokenProvider();
//     const userReadProvider = new UserReadProvider();
//     const userUpdateProvider = new UserUpdateProvider();

//     authPasswordResetRequestService = new AuthPasswordResetRequestService(userReadProvider, tokenProvider);
//     authPasswordResetService = new AuthPasswordResetService(tokenProvider, userReadProvider, userUpdateProvider);

//     container.registerInstance(AuthPasswordResetService, authPasswordResetService);
//     container.registerInstance(AuthPasswordResetRequestService, authPasswordResetRequestService);

//     app = new Application();
//     server = app.server.listen();
//     await app.express.initializeServices();
//   });

//   container.resolve(AuthPasswordResetController);

//   afterAll(async () => {
//     const dbClient = new PrismaClient();
//     try {
//       await dbClient.$transaction([dbClient.userToken.deleteMany()]);

//       await dbClient.user.deleteMany();
//       await dbClient.tenant.deleteMany();

//       await dbClient.user.deleteMany();
//     } catch (error) {
//       console.error("Error during cleanup:", error);
//     } finally {
//       await dbClient.$disconnect();
//       server.close();
//     }
//   });

//   it("Should handle user password reset request successfully", async () => {
//     await request(server).post("/api/auth/signup").send({
//       firstName: "Luke",
//       lastName: "Combs",
//       phoneNumber: "09052916792",
//       email: "sogbesansegun1@gmail.com",
//       password: "123456",
//     });

//     const response = await request(server).get("/api/auth/password-reset/request").send({
//       email: "sogbesansegun1@gmail.com",
//     });

//     expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
//     expect(response.body).toMatchObject({
//       status: SUCCESS,
//       statusCode: HttpStatusCodeEnum.SUCCESS,
//       data: {
//         message: PASSWORD_RESET_LINK_GENERATED,
//       },
//     });
//   }, 10000);

//   it("Should handle invalid user password reset", async () => {
//     const response = await request(server).post("/api/auth/password-reset/12345").send({
//       password: "password",
//     });

//     expect(response.status).toBe(400);
//     expect(response.body).toMatchObject({
//       status: ERROR,
//       statusCode: HttpStatusCodeEnum.BAD_REQUEST,
//       data: {
//         message: ERROR_INVALID_TOKEN,
//       },
//     });
//   });
// });
