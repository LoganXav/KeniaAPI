import { Server } from "http";
import request from "supertest";
import { container } from "tsyringe";
import TokenProvider from "../../providers/Token.provider";
import AuthPasswordResetService from "../../services/AuthPasswordReset.service";
import { Application } from "../../../../../infrastructure/internal/application";
import AuthPasswordResetController from "../../controllers/AuthPasswordReset.controller";
import AuthPasswordResetRequestService from "../../services/AuthPasswordResetRequest.service";
import UserInternalApiProvider from "../../../../shared/providers/user/UserInternalApi.provider";

describe("Auth Password Reset Controller", () => {
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
    const mockResult = {
      status: "success",
      statusCode: 200,
      message: "Password reset requested successfully",
      toResultDto: jest.fn(() => ({
        status: "success",
        statusCode: 200,
        data: {
          message: "Password reset requested successfully",
        },
      })),
    };

    authPasswordResetRequestService.execute = jest.fn().mockResolvedValue(mockResult);

    const response = await request(server).get("/api/auth/password-reset/request").send({
      email: "sogbesansegun21@gmail.com",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResult.toResultDto());
  });

  it("Should handle user password request successfully", async () => {
    const mockResult = {
      status: "success",
      statusCode: 200,
      message: "Password reset successfully",
      toResultDto: jest.fn(() => ({
        status: "success",
        statusCode: 200,
        data: {
          message: "Password reset successfully",
        },
      })),
    };

    authPasswordResetService.execute = jest.fn().mockResolvedValue(mockResult);

    const response = await request(server).post("/api/auth/password-reset/:token").send({
      password: "password",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResult.toResultDto());
  });
});
