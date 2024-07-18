import request from "supertest";
import { Application } from "../../application";
import ApplicationError from "../ApplicationError";
import { errorHandler } from "../ErrorHandler";
import { HttpStatusCodeEnum } from "../../../../api/shared/helpers/enums/HttpStatusCode.enum";
import { ERROR } from "../../../../api/shared/helpers/messages/SystemMessages";
import { NextFunction, Request, Response } from "express";

describe("ErrorHandler", () => {
  it("Should handle trusted errors", async () => {
    const app = new Application();
    const server = app.express.app;
    const error = new ApplicationError({
      httpStatusCode: HttpStatusCodeEnum.BAD_REQUEST,
      description: "Test error",
      isOperational: true,
    });

    server.use((req: Request, res: Response, next: NextFunction) => {
      errorHandler.handleError(error, res);
    });

    const response = await request(server).get("/api/ping");

    expect(response.status).toBe(error.httpStatusCode);
    expect(response.body).toEqual({
      statusCode: error.httpStatusCode,
      status: ERROR,
      message: error.description,
    });
  });

  it("Should handle critical errors", async () => {
    const app = new Application();
    const server = app.express.app;
    const error = new Error("Test critical error");

    // Mock process.exit
    const originalExit = process.exit;
    process.exit = jest.fn() as any;

    server.use((req: Request, res: Response, next: NextFunction) => {
      errorHandler.handleError(error, res);
    });

    const response = await request(server).get("/api/ping");

    expect(response.status).toBe(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
      statusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      status: ERROR,
      message: error.message,
    });

    // Verify that process.exit was called with code 1
    expect(process.exit).toHaveBeenCalledWith(1);

    // Restore process.exit to its original implementation
    process.exit = originalExit;
  });
});
