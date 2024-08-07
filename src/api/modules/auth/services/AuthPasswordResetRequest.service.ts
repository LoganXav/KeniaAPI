import { DateTime } from "luxon";
import { autoInjectable } from "tsyringe";
import { TokenType } from "@prisma/client";
import TokenProvider from "../providers/Token.provider";
import { businessConfig } from "~/config/BusinessConfig";
import DbClient from "~/infrastructure/internal/database";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { generateStringOfLength } from "~/utils/GenerateStringOfLength";
import { EmailService } from "~/api/shared/services/email/Email.service";
import UserReadProvider from "~/api/modules/user/providers/UserRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, NULL_OBJECT, PASSWORD_RESET_LINK_GENERATED, SOMETHING_WENT_WRONG, SUCCESS, USER_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class AuthPasswordResetRequestService extends BaseService<unknown> {
  static serviceName = "AuthPasswordResetRequestService";
  tokenProvider: TokenProvider;
  loggingProvider: ILoggingDriver;
  userReadProvider: UserReadProvider;
  constructor(userReadProvider: UserReadProvider, tokenProvider: TokenProvider) {
    super(AuthPasswordResetRequestService.serviceName);
    this.tokenProvider = tokenProvider;
    this.userReadProvider = userReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }
  public async execute(trace: ServiceTrace, args: { email: string }): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);
      const { email } = args;

      const foundUser = await this.userReadProvider.getOneByCriteria({
        email,
      });

      if (foundUser === NULL_OBJECT) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(USER_RESOURCE));
      }

      const data = await this.passwordResetTokenTransaction(foundUser.id, foundUser.email);

      await EmailService.sendPasswordResetLink(data);

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, PASSWORD_RESET_LINK_GENERATED);

      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  private async passwordResetTokenTransaction(userId: number, email: string) {
    try {
      const result = await DbClient.$transaction(async (tx) => {
        const passwordResetToken = await this.tokenProvider.getOneByCriteria(
          {
            userId,
            tokenType: TokenType.PASSWORD_RESET,
            expired: false,
            isActive: true,
          },
          tx
        );

        if (passwordResetToken) {
          this.tokenProvider.updateOneByCriteria(
            {
              tokenId: passwordResetToken.id,
              expired: true,
              isActive: false,
            },
            tx
          );
        }

        const token = generateStringOfLength(businessConfig.passwordResetTokenLength);

        const expiresAt = DateTime.now().plus({ minutes: businessConfig.emailTokenExpiresInMinutes }).toJSDate();

        const newPasswordResetToken = await this.tokenProvider.create(
          {
            userId,
            tokenType: TokenType.PASSWORD_RESET,
            expiresAt,
            token: token,
          },
          tx
        );

        const passwordResetLink = `${businessConfig.passwordResetTokenLink}/${newPasswordResetToken.token}`;

        const sendPasswordResetLinkArgs = {
          userEmail: email,
          passwordResetLink: passwordResetLink,
        };
        return sendPasswordResetLinkArgs;
      });
      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
