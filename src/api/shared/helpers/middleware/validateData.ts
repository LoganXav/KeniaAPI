import { ZodError, z } from "zod";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { INextFunction, IRequest, IResponse } from "~/infrastructure/internal/types";
import { INTERNAL_SERVER_ERROR, VALIDATION_ERROR } from "~/api/shared/helpers/messages/SystemMessages";

export function validateData(schema: z.ZodTypeAny) {
  return async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: issue.message,
        }));
        res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ error: VALIDATION_ERROR, details: errorMessages });
      } else {
        res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: INTERNAL_SERVER_ERROR });
      }
    }
  };
}

export function validateParams(schema: z.ZodTypeAny) {
  return async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const validatedQueryParams = await schema.parseAsync(req.query);
      req.query = validatedQueryParams;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: issue.message,
        }));
        res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ error: VALIDATION_ERROR, details: errorMessages });
      } else {
        res.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: INTERNAL_SERVER_ERROR });
      }
    }
  };
}
