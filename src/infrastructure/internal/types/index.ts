import { Request, Response, NextFunction } from "express";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { LocaleTypeEnum } from "~/api/shared/helpers/enums/LocalType.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";

export type HeaderType = {
  [key in HttpHeaderEnum]?: HttpContentTypeEnum | string;
};

export type EntryPointHandler = (req: IRequest, res: IResponse, next: INextFunction) => Promise<void>;

export interface IResponse {
  trace: ServiceTrace;
  status(code: number): IResponse;
  send(body: unknown): IResponse;
  json(body: unknown): IResponse;
  setHeader(name: string, value: number | string): this;
}

export interface IRequest {
  isWhiteList: boolean;
  isProtected: boolean;
  session: ISession;
  body: any;
  params: any;
  query: any;
  locale: LocaleTypeEnum;
  ipAddress: string;
  userAgent: string;
  origin: string;
}

export interface INextFunction {
  (error?: unknown): void;
}

export interface ISession {
  sessionId: string;
  maskedUserUid: string;
  email: string;
  emailVerified: boolean;
  name: string;
  iat: number;
  exp: number;
}

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export interface IRouter {
  (): IRouter;
  [HttpMethodEnum.GET](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.POST](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.PUT](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.DELETE](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.PATCH](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.OPTIONS](path: string, ...handlers: EntryPointHandler[]): IRouter;
  [HttpMethodEnum.HEAD](path: string, ...handlers: EntryPointHandler[]): IRouter;
}
