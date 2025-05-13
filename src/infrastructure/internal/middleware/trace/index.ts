import GuidUtil from "~/utils/GuidUtil";
import { TypeParser } from "~/utils/TypeParser";
import { NextFunction, Request, Response } from "express";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { IRequest, IResponse, ISession, Middleware } from "~/infrastructure/internal/types";

class ServiceTraceMiddleware {
  handle: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    TypeParser.cast<IResponse>(res).trace = new ServiceTrace(
      TypeParser.cast<IRequest>(req).isWhiteList ? TypeParser.cast<ISession>({}) : TypeParser.cast<IRequest>(req).session,
      new Date(),
      TypeParser.cast<IRequest>(req).origin,
      (req.headers[HttpHeaderEnum.TRANSACTION_ID] as string) || GuidUtil.getV4WithoutDashes()
    )
      .setRequest({
        params: req.params,
        query: req.query,
        body: undefined,
      })
      .setClient({
        ip: TypeParser.cast<IRequest>(req).ipAddress,
        agent: TypeParser.cast<IRequest>(req).userAgent,
      });

    return next();
  };
}

export default new ServiceTraceMiddleware();
