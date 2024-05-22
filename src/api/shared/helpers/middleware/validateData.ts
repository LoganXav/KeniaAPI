import { ZodError, z } from "zod"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import {
  INTERNAL_SERVER_ERROR,
  VALIDATION_ERROR
} from "~/api/shared/helpers/messages/SystemMessages"
import {
  INextFunction,
  IRequest,
  IResponse
} from "~/infrastructure/internal/types"

export function validateData(schema: z.ZodObject<any, any>) {
  return async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: issue.message
        }))
        res
          .status(HttpStatusCodeEnum.BAD_REQUEST)
          .json({ error: VALIDATION_ERROR, details: errorMessages })
      } else {
        res
          .status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR)
          .json({ error: INTERNAL_SERVER_ERROR })
      }
    }
  }
}
