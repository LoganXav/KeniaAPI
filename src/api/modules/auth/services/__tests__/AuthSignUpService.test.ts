import { DateTime } from "luxon";
import { UserType } from "@prisma/client";
import Event from "../../../../shared/helpers/events";
import AuthSignUpService from "../AuthSignUp.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DbClient from "../../../../../infrastructure/internal/database";
import { ISession } from "../../../../../infrastructure/internal/types";
import { eventTypes } from "../../../../shared/helpers/enums/EventTypes.enum";
import { generateStringOfLength } from "../../../../../utils/GenerateStringOfLength";
import { HttpStatusCodeEnum } from "../../../../shared/helpers/enums/HttpStatusCode.enum";
import { PasswordEncryptionService } from "../../../../shared/services/encryption/PasswordEncryption.service";
import { ACCOUNT_CREATED, SUCCESS } from "../../../../shared/helpers/messages/SystemMessages";

jest.mock("../../../../shared/helpers/events");
jest.mock("../../../../../utils/GenerateStringOfLength");
jest.mock("../../../../../infrastructure/internal/database");
jest.mock("../../../../shared/services/encryption/PasswordEncryption.service");

describe("Auth Signup Service", () => {
  let DbClientMock: any;

  beforeEach(() => {
    DbClientMock = {
      $transaction: jest.fn(),
    };
    (DbClient as any) = DbClientMock;
  });

  test("Should signup a new user and return a token", async () => {
    // Mock Dependencies
    const mockTokenProvider = {
      create: jest.fn(),
      getOneByCriteria: jest.fn(),
      getByCriteria: jest.fn(),
      updateOneByCriteria: jest.fn(),
    };
    const mockUserReadProvider = {
      getOneByCriteria: jest.fn().mockReturnValue(null),
    };
    const mockTenantCreateProvider = {
      create: jest.fn(),
    };
    const mockUserCreateProvider = {
      create: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockLoggingProvider = {
      error: jest.fn(),
    };

    const mockEventEmit = jest.spyOn(Event, "emit");

    const service = new AuthSignUpService(mockTokenProvider, mockUserReadProvider, mockTenantCreateProvider, mockUserCreateProvider);

    // Mock Input Arguments
    const trace = getSuccessTrace();
    const args = getUser();

    // Mock Results
    const otpToken = "123456";
    const createdTenant = { id: 1 };
    const hashedPassword = "hashedPassword123";
    const createdUser = { id: 2, tenantId: 1, email: args.email };

    PasswordEncryptionService.hashPassword.mockReturnValue(hashedPassword);
    generateStringOfLength.mockReturnValue(otpToken);
    DateTime.now = jest.fn().mockReturnValue({
      plus: jest.fn().mockReturnValue({
        toJSDate: jest.fn().mockReturnValue(new Date()),
      }),
    });

    mockTenantCreateProvider.create.mockReturnValue(createdTenant);
    mockUserCreateProvider.create.mockReturnValue(createdUser);
    mockTokenProvider.create.mockReturnValue({ user: createdUser, otpToken });

    DbClientMock.$transaction = jest.fn().mockImplementation(async (fn) => {
      return await fn({
        tenantCreateProvider: mockTenantCreateProvider,
        userCreateProvider: mockUserCreateProvider,
        tokenProvider: mockTokenProvider,
      });
    });

    const result = await service.execute(trace, args);

    // Assertions
    expect(mockUserReadProvider.getOneByCriteria).toHaveBeenCalledWith({ email: args.email });
    expect(PasswordEncryptionService.hashPassword).toHaveBeenCalledWith(args.password);
    expect(mockTenantCreateProvider.create).toHaveBeenCalledWith(null, expect.any(Object));
    expect(mockUserCreateProvider.create).toHaveBeenCalledWith({ ...args, password: hashedPassword }, expect.any(Object));
    expect(mockTokenProvider.create).toHaveBeenCalledWith({ userId: createdUser.id, tokenType: "EMAIL", expiresAt: expect.any(Date), token: otpToken }, expect.any(Object));
    expect(mockEventEmit).toHaveBeenCalledWith(eventTypes.user.signUp, { userEmail: args.email, activationToken: otpToken });
    expect(trace.setSuccessful).toHaveBeenCalled();
    expect(result.toResultDto()).toMatchObject({ status: SUCCESS, statusCode: HttpStatusCodeEnum.CREATED, data: { message: ACCOUNT_CREATED, data: { id: createdUser.id, tenantId: createdUser.tenantId } } });
  });
});

function getUser() {
  return {
    firstName: "Ricky",
    lastName: "Holmes",
    phoneNumber: "08026372526",
    email: "test@example.com",
    password: "password123",
    tenantId: 1,
    userType: UserType.STAFF,
  };
}

function getSuccessTrace() {
  return {
    setSuccessful: jest.fn(),
    context: "",
    client: { ip: "", agent: "" },
    startDate: "",
    endDate: "",
    success: true,
    payload: {},
    metadata: {},
    session: {} as ISession,
    origin: "",
    transactionId: "",
    toJSON: jest.fn(),
    setContext: jest.fn(),
    setClient: jest.fn(),
    setRequest: jest.fn(),
    setArgs: jest.fn(),
    addMetadata: jest.fn(),
    finish: jest.fn(),
  };
}
