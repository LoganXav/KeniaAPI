import { Server } from "http";
import request from "supertest";
import { container } from "tsyringe";
import TokenProvider from "../providers/Token.provider";
import AuthPasswordResetService from "../services/AuthPasswordReset.service";
import { Application } from "../../../../infrastructure/internal/application";
import AuthPasswordResetController from "../controllers/AuthPasswordReset.controller";
import AuthPasswordResetRequestService from "../services/AuthPasswordResetRequest.service";
import UserInternalApiProvider from "../../../shared/providers/user/UserInternalApi.provider";

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
    server.close();
  });

  it("Should handle user password reset request successfully", async () => {
    const response = await request(server).get("/api/auth/password-reset/request").send({
      email: "sogbesansegun1@gmail.com",
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "success",
      statusCode: 200,
      data: {
        message: "Password Recovery Link Generated. Please Check your mail",
      },
    });
  });

  it("Should handle user password request successfully", async () => {
    const response = await request(server).post("/api/auth/password-reset/:12345").send({
      password: "password",
    });

    expect(response.status).toBe(200);
    // expect(response.body).toEqual(mockResult.toResultDto());
  });
});
