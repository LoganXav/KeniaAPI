import LoggingConfig from "~/config/LoggingConfig"
import { LoggingProvider } from "./LoggingProvider"
import { PROVIDER_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessages"
import { WinstonDriver } from "./WinstonDriver"

export class LoggingProviderFactory {
  public static build() {
    if (this.getLoggingProvider() === "winston") {
      return new LoggingProvider(new WinstonDriver())
    } else {
      throw new Error(PROVIDER_NOT_FOUND)
    }
  }

  public static getLoggingProvider() {
    return LoggingConfig.LOGGING_PROVIDER
  }
}
