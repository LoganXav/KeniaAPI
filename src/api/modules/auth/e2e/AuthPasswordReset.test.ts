import { Server } from "http";
import request from "supertest";
import { container } from "tsyringe";
import TokenProvider from "../providers/Token.provider";
import AuthPasswordResetService from "../services/AuthPasswordReset.service";
import { Application } from "../../../../infrastructure/internal/application";
import AuthPasswordResetController from "../controllers/AuthPasswordReset.controller";
import { HttpStatusCodeEnum } from "../../../shared/helpers/enums/HttpStatusCode.enum";
import AuthPasswordResetRequestService from "../services/AuthPasswordResetRequest.service";
import UserInternalApiProvider from "../../../shared/providers/user/UserInternalApi.provider";
import { ERROR, ERROR_INVALID_TOKEN, PASSWORD_RESET_LINK_GENERATED, SUCCESS } from "../../../shared/helpers/messages/SystemMessages";
import { PrismaClient } from "@prisma/client";

describe("Auth Password Reset", () => {
  let server: Server;
  let app: Application;
  let authPasswordResetRequestService: AuthPasswordResetRequestService;
  let authPasswordResetService: AuthPasswordResetService;
  let authPasswordResetController: AuthPasswordResetController;

  beforeAll(async () => {
    container.clearInstances();

    const tokenProvider = new TokenProvider();
    const userInternalApiProvider = new UserInternalApiProvider();

    authPasswordResetRequestService = new AuthPasswordResetRequestService(userInternalApiProvider, tokenProvider);
    authPasswordResetService = new AuthPasswordResetService(tokenProvider, userInternalApiProvider);

    container.registerInstance(AuthPasswordResetService, authPasswordResetService);
    container.registerInstance(AuthPasswordResetRequestService, authPasswordResetRequestService);

    app = new Application();
    server = app.server.listen();
    await app.express.initializeServices();
  });

  authPasswordResetController = container.resolve(AuthPasswordResetController);

  afterAll(async () => {
    const prisma = new PrismaClient();
    try {
      await prisma.$transaction([prisma.userToken.deleteMany()]);

      await prisma.user.deleteMany();
      await prisma.tenant.deleteMany();

      await prisma.user.deleteMany();
    } catch (error) {
      console.error("Error during cleanup:", error);
    } finally {
      await prisma.$disconnect();
      server.close();
    }
  });

  it("Should handle user password reset request successfully", async () => {
    await request(server).post("/api/auth/signup").send({
      firstName: "Luke",
      lastName: "Combs",
      phoneNumber: "09052916792",
      email: "sogbesansegun1@gmail.com",
      password: "123456",
    });

    const response = await request(server).get("/api/auth/password-reset/request").send({
      email: "sogbesansegun1@gmail.com",
    });

    expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
    expect(response.body).toMatchObject({
      status: SUCCESS,
      statusCode: HttpStatusCodeEnum.SUCCESS,
      data: {
        message: PASSWORD_RESET_LINK_GENERATED,
      },
    });
  }, 10000);

  it("Should handle invalid user password reset", async () => {
    const response = await request(server).post("/api/auth/password-reset/12345").send({
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      status: ERROR,
      statusCode: HttpStatusCodeEnum.BAD_REQUEST,
      data: {
        message: ERROR_INVALID_TOKEN,
      },
    });
  });
});
