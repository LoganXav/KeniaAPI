# KeniaAPI: Modular Monolith Node.js API Server

This project is a template for building a modular monolith API server using Node.js and Express. It is designed to provide a scalable and maintainable architecture for building complex server-side applications.

import AuthOnboardingController from "../AuthOnboarding.controller";

import AuthSignUpService from "../../services/AuthSignUp.service";
import AuthSignInService from "../../services/AuthSignIn.service";
import request from "supertest";
import "reflect-metadata"; // Required for tsyringe
import { Application } from "../../../../../infrastructure/internal/application";
import { container } from "tsyringe";
import TokenProvider from "../../providers/Token.provider";
import UserInternalApiProvider from "../../../../shared/providers/user/UserInternalApi.provider";
import TenantInternalApiProvider from "../../../../shared/providers/tenant/TenantInternalApi.provider";
import StaffReadProvider from "../../../../modules/staff/providers/StaffRead.provider";
import { Server } from "http";
import { ACCOUNT_CREATED, SIGN_IN_SUCCESSFUL, SUCCESS } from "../../../../shared/helpers/messages/SystemMessages";
import { HttpStatusCodeEnum } from "../../../../shared/helpers/enums/HttpStatusCode.enum";

jest.mock("../../services/AuthSignUp.service");
jest.mock("../../services/AuthSignIn.service");

describe("AuthOnboardingController", () => {
let app: Application;
let authSignUpService: AuthSignUpService;
let authSignInService: AuthSignInService;
let authOnboardingController: AuthOnboardingController;
let server: Server;

beforeEach(() => {
container.clearInstances();

    const tokenProvider = new TokenProvider();
    const userInternalApiProvider = new UserInternalApiProvider();
    const tenantInternalApiProvider = new TenantInternalApiProvider();
    const staffReadProvider = new StaffReadProvider();

    authSignUpService = new AuthSignUpService(tokenProvider, userInternalApiProvider, tenantInternalApiProvider);
    authSignInService = new AuthSignInService(userInternalApiProvider, staffReadProvider);

    container.registerInstance(AuthSignUpService, authSignUpService);
    container.registerInstance(AuthSignInService, authSignInService);

    // app = new Application();
    // app.start();
    // server = app.express.app;

    authOnboardingController = container.resolve(AuthOnboardingController);

});

beforeAll(async () => {
app = new Application();
await app.express.initializeServices(); // Initialize any required services
server = app.server.listen(); // Start server listening on a random port or specific port
});

afterAll(async () => {
server.close(); // Close server after all tests are done
});

it("Should sign up a user successfully", async () => {
// const mockResult = {
// status: SUCCESS,
// statusCode: HttpStatusCodeEnum.CREATED,
// message: ACCOUNT_CREATED,
// toResultDto: jest.fn(() => ({
// status: SUCCESS,
// statusCode: HttpStatusCodeEnum.CREATED,
// data: {
// message: ACCOUNT_CREATED,
// data: { token: "abcd1234" },
// accessToken: "mockAccessToken",
// },
// })),
// };

    const mockResult = {
      status: "success",
      statusCode: 200,
      message: "User signed in successfully",
      result: {
        token: "abcd1234",
        toResultDto: jest.fn(() => ({
          status: "success",
          statusCode: 200,
          data: {
            message: "User signed in successfully",
            data: { token: "abcd1234" },
            accessToken: "mockAccessToken",
          },
        })),
      },
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

    authSignUpService.execute = jest.fn().mockResolvedValue(mockResult);

    const response = await request(server).post("/api/auth/signup").send({
      firstName: "Luke",
      lastName: "Combs",
      phoneNumber: "09052916792",
      email: "sogbesansegun21@gmail.com",
      password: "123456",
    });

    console.log(response.error);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockResult.toResultDto());

});

// it("Should sign in a user successfully", async () => {
// const mockResult = {
// status: SUCCESS,
// statusCode: HttpStatusCodeEnum.SUCCESS,
// message: SIGN_IN_SUCCESSFUL,
// toResultDto: jest.fn(() => ({
// status: SUCCESS,
// statusCode: HttpStatusCodeEnum.SUCCESS,
// data: {
// message: SIGN_IN_SUCCESSFUL,
// data: { token: "abcd1234" },
// accessToken: "mockAccessToken",
// },
// })),
// };
// authSignInService.execute = jest.fn().mockResolvedValue(mockResult);

// const response = await request(server).post("/api/auth/signin").send({ email: "test@example.com", password: "password123" });

// expect(response.status).toBe(200);
// expect(response.body).toEqual(mockResult.toResultDto());
// });

// it("Should handle sign up errors", async () => {
// const mockError = {
// status: "error",
// statusCode: 400,
// message: "Sign up failed",
// result: null,
// };
// authSignUpService.execute = jest.fn().mockResolvedValue(mockError);

// const response = await request(server).post("/api/auth/signup").send({ email: "test@example.com", password: "password123" });

// expect(response.status).toBe(400);
// expect(response.body).toEqual(mockError);
// });

// it("Should handle sign in errors", async () => {
// const mockError = {
// status: "error",
// statusCode: 401,
// message: "Invalid credentials",
// result: null,
// };
// authSignInService.execute = jest.fn().mockResolvedValue(mockError);

// const response = await request(server).post("/api/auth/signin").send({ email: "test@example.com", password: "wrongpassword" });

// expect(response.status).toBe(401);
// expect(response.body).toEqual(mockError);
// });

// it("Should add routes for signUp and signIn", () => {
// const mockRouter = {
// post: jest.fn(),
// };
// authOnboardingController.initializeRoutes(mockRouter as any);

// expect(mockRouter.post).toHaveBeenCalledTimes(2);
// expect(mockRouter.post).toHaveBeenCalledWith(
// "/api/auth/signup",
// expect.any(Function), // middleware
// expect.any(Function) // handler
// );
// expect(mockRouter.post).toHaveBeenCalledWith(
// "/auth/signin",
// expect.any(Function), // middleware
// expect.any(Function) // handler
// );
// });
});
