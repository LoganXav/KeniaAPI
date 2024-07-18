import Express from "../index";
import { resolve } from "path";
import { Router } from "express";
import { container } from "tsyringe";
import { sync } from "fast-glob";
import ServerConfig from "../../../../config/ServerConfig";
import AppSettings from "../../../../api/shared/setttings/AppSettings";

jest.mock("fast-glob", () => ({
  sync: jest.fn(),
}));

jest.mock("tsyringe", () => ({
  container: {
    resolve: jest.fn(),
  },
}));

jest.mock("path", () => ({
  ...jest.requireActual("path"),
  resolve: jest.fn(),
}));

describe("Load Controllers", () => {
  let app: Express;

  beforeAll(() => {
    app = new Express();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    ServerConfig.Controllers.DefaultPath = ["../../../../api/modules/status/controllers/*.controller.ts"];
    AppSettings.ServerRoot = "/api";
  });

  it("Should load controllers dynamically and initialize routes", async () => {
    // Mock controller paths
    const mockControllerPaths = ["../../../api/modules/status/controllers/Status.controller.ts"];
    (sync as jest.Mock).mockReturnValue(mockControllerPaths);

    // Mock resolved path
    (resolve as jest.Mock).mockImplementation((path) => path);

    // Mock controller class
    const mockController = {
      initializeRoutes: jest.fn(),
      router: Router(),
      controllerName: "MockController",
    };

    // Mock dynamic import of the controller
    jest.mock("../../../../api/modules/status/controllers/Status.controller", () => ({
      default: jest.fn(() => mockController),
    }));

    // Mock container resolve
    (container.resolve as jest.Mock).mockReturnValue(mockController);

    // Access the private method using TypeScript's index signature
    await (app as any).loadControllersDynamically();

    // Verify that the initializeRoutes method was called
    expect(mockController.initializeRoutes).toHaveBeenCalledWith(expect.any(Function));

    // Verify that the controller's routes are registered in the app
    expect(app.app._router.stack).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          handle: expect.any(Function),
        }),
      ])
    );
  });
});
