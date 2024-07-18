import { Server } from "http";
import request from "supertest";
import { container } from "tsyringe";
import TokenProvider from "../../providers/Token.provider";
import AuthSignUpService from "../../services/AuthSignUp.service";
import AuthSignInService from "../../services/AuthSignIn.service";
import AuthOnboardingController from "../AuthOnboarding.controller";
import { Application } from "../../../../../infrastructure/internal/application";
import StaffReadProvider from "../../../../modules/staff/providers/StaffRead.provider";
import UserInternalApiProvider from "../../../../shared/providers/user/UserInternalApi.provider";
import TenantInternalApiProvider from "../../../../shared/providers/tenant/TenantInternalApi.provider";

describe("AuthOnboardingController", () => {
  let server: Server;
  let app: Application;
  let authSignUpService: AuthSignUpService;
  let authSignInService: AuthSignInService;
  let authOnboardingController: AuthOnboardingController;

  beforeAll(async () => {
    container.clearInstances();

    const tokenProvider = new TokenProvider();
    const staffReadProvider = new StaffReadProvider();
    const userInternalApiProvider = new UserInternalApiProvider();
    const tenantInternalApiProvider = new TenantInternalApiProvider();

    authSignInService = new AuthSignInService(userInternalApiProvider, staffReadProvider);
    authSignUpService = new AuthSignUpService(tokenProvider, userInternalApiProvider, tenantInternalApiProvider);

    container.registerInstance(AuthSignUpService, authSignUpService);
    container.registerInstance(AuthSignInService, authSignInService);

    app = new Application();
    server = app.server.listen();
    await app.express.initializeServices();
  });

  authOnboardingController = container.resolve(AuthOnboardingController);

  afterAll(async () => {
    server.close();
  });

  it("Should sign up a user successfully", async () => {
    const mockResult = {
      status: "success",
      statusCode: 201,
      message: "User signed in successfully",
      toResultDto: jest.fn(() => ({
        status: "success",
        statusCode: 201,
        data: {
          message: "User signed in successfully",
          data: { token: "abcd1234" },
          accessToken: "mockAccessToken",
        },
      })),
    };

    authSignUpService.execute = jest.fn().mockResolvedValue(mockResult);

    const response = await request(server).post("/api/auth/signup").send({
      firstName: "Luke",
      lastName: "Combs",
      phoneNumber: "09052916792",
      email: "sogbesansegun21@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockResult.toResultDto());
  });

  it("Should sign in a user successfully", async () => {
    const mockResult = {
      status: "success",
      statusCode: 200,
      message: "User signed in successfully",
      toResultDto: jest.fn(() => ({
        status: "success",
        statusCode: 200,
        data: {
          message: "User signed in successfully",
          data: { token: "abcd1234" },
          accessToken: "mockAccessToken",
        },
      })),
    };

    authSignInService.execute = jest.fn().mockResolvedValue(mockResult);

    const response = await request(server).post("/api/auth/signin").send({
      email: "sogbesansegun21@gmail.com",
      password: "123456",
      userType: "string",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResult.toResultDto());
  });

  it("Should handle sign up errors", async () => {
    const mockError = {
      status: "error",
      statusCode: 400,
      message: "Sign up failed",
      toResultDto: jest.fn(() => ({
        status: "error",
        statusCode: 400,
        data: {
          message: "Sign up failed",
          data: null,
          accessToken: undefined,
        },
      })),
    };

    authSignUpService.execute = jest.fn().mockResolvedValue(mockError);

    const response = await request(server).post("/api/auth/signup").send({
      firstName: "Luke",
      lastName: "Combs",
      phoneNumber: "09052916792",
      email: "sogbesansegun21@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(mockError.toResultDto());
  });

  it("Should handle sign in errors", async () => {
    const mockError = {
      status: "error",
      statusCode: 400,
      message: "Sign up failed",
      toResultDto: jest.fn(() => ({
        status: "error",
        statusCode: 400,
        data: {
          message: "Sign up failed",
          data: null,
          accessToken: undefined,
        },
      })),
    };

    authSignInService.execute = jest.fn().mockResolvedValue(mockError);

    const response = await request(server).post("/api/auth/signin").send({ email: "sogbesansegun21@gmail.com", password: "123456", userType: "string" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(mockError.toResultDto());
  });
});
