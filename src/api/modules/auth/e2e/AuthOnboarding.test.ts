import { Server } from "http";
import request from "supertest";
import { container } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import TokenProvider from "../providers/Token.provider";
import AuthSignUpService from "../services/AuthSignUp.service";
import AuthSignInService from "../services/AuthSignIn.service";
import StaffReadProvider from "../../staff/providers/StaffRead.provider";
import { Application } from "../../../../infrastructure/internal/application";
import AuthOnboardingController from "../controllers/AuthOnboarding.controller";
import TenantCreateProvider from "../../tenant/providers/TenantCreate.provider";
import UserReadProvider from "../../../shared/providers/user/UserRead.provider";
import UserCreateProvider from "../../../shared/providers/user/UserCreate.provider";
import UserUpdateProvider from "../../../shared/providers/user/UserUpdate.provider";
import { HttpStatusCodeEnum } from "../../../shared/helpers/enums/HttpStatusCode.enum";
import { ACCOUNT_CREATED, SIGN_IN_SUCCESSFUL, SUCCESS } from "../../../shared/helpers/messages/SystemMessages";

describe("Auth Onboarding", () => {
  let server: Server;
  let app: Application;
  let authSignUpService: AuthSignUpService;
  let authSignInService: AuthSignInService;
  let authOnboardingController: AuthOnboardingController;

  beforeAll(async () => {
    container.clearInstances();

    const tokenProvider = new TokenProvider();
    const userReadProvider = new UserReadProvider();
    const staffReadProvider = new StaffReadProvider();
    const userCreateProvider = new UserCreateProvider();
    const userUpdateProvider = new UserUpdateProvider();
    const tenantCreateProvider = new TenantCreateProvider();

    authSignInService = new AuthSignInService(userReadProvider, staffReadProvider, userUpdateProvider);
    authSignUpService = new AuthSignUpService(tokenProvider, userReadProvider, tenantCreateProvider, userCreateProvider);

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
      email: "sogbesansegun3@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(HttpStatusCodeEnum.CREATED);
    expect(response.body).toMatchObject({
      status: SUCCESS,
      statusCode: HttpStatusCodeEnum.CREATED,
      data: {
        message: ACCOUNT_CREATED,
        data: {
          id: expect.any(Number),
          tenantId: expect.any(Number),
        },
      },
    });
  });

  it("Should sign in a user successfully", async () => {
    const response = await request(server).post("/api/auth/signin").send({
      email: "sogbesansegun3@gmail.com",
      userType: "Student",
      password: "123456",
    });

    expect(response.status).toBe(HttpStatusCodeEnum.SUCCESS);
    expect(response.body).toMatchObject({
      status: SUCCESS,
      statusCode: HttpStatusCodeEnum.SUCCESS,
      data: {
        message: SIGN_IN_SUCCESSFUL,
        data: {
          id: expect.any(Number),
          tenantId: expect.any(Number),
        },
      },
    });
  });
});
