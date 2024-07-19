import { Server } from "http";
import request from "supertest";
import { container } from "tsyringe";
import TokenProvider from "../providers/Token.provider";
import AuthSignInService from "../services/AuthSignIn.service";
import AuthSignUpService from "../services/AuthSignUp.service";
import StaffReadProvider from "../../staff/providers/StaffRead.provider";
import { Application } from "../../../../infrastructure/internal/application";
import AuthOnboardingController from "../controllers/AuthOnboarding.controller";
import UserInternalApiProvider from "../../../shared/providers/user/UserInternalApi.provider";
import TenantInternalApiProvider from "../../../shared/providers/tenant/TenantInternalApi.provider";
import { PrismaClient } from "@prisma/client";

describe("Auth Onboarding", () => {
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

  it("Should sign up a user successfully", async () => {
    const response = await request(server).post("/api/auth/signup").send({
      firstName: "Luke",
      lastName: "Combs",
      phoneNumber: "09052916792",
      email: "sogbesansegun1@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      status: "success",
      statusCode: 201,
      data: {
        message: "Account Created Successfully",
        data: {
          id: expect.any(Number),
          firstName: "Luke",
          lastName: "Combs",
          phoneNumber: "09052916792",
          email: "sogbesansegun1@gmail.com",
          hasVerified: expect.any(Boolean),
          isFirstTimeLogin: expect.any(Boolean),
          lastLoginDate: expect.any(String),
          tenantId: expect.any(Number),
        },
        accessToken: expect.any(String),
      },
    });
  });

  it("Should sign in a user successfully", async () => {
    const response = await request(server).post("/api/auth/signin").send({
      email: "sogbesansegun1@gmail.com",
      userType: "Student",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "success",
      statusCode: 200,
      data: {
        message: "Sign In Successful",
        data: {
          user: {
            id: expect.any(Number),
            firstName: "Luke",
            lastName: "Combs",
            phoneNumber: "09052916792",
            email: "sogbesansegun1@gmail.com",
            hasVerified: expect.any(Boolean),
            isFirstTimeLogin: expect.any(Boolean),
            lastLoginDate: expect.any(String),
            tenantId: expect.any(Number),
          },
        },
        accessToken: expect.any(String),
      },
    });
  });
});
