import { createClient, RedisClientType, RedisDefaultModules } from "redis";
import { LoggingProviderFactory } from "../logger/LoggingProviderFactory";
import { ILoggingDriver } from "../logger/ILoggingDriver";
import AppSettings from "~/api/shared/setttings/AppSettings";

class RedisClient {
  private static instance: RedisClientType<RedisDefaultModules>;
  private static loggingProvider: ILoggingDriver = LoggingProviderFactory.build();

  private constructor() {}

  public static getInstance(): RedisClientType<RedisDefaultModules> {
    if (!RedisClient.instance) {
      RedisClient.instance = createClient({
        url: AppSettings.getCacheUrl(),
      }) as RedisClientType<RedisDefaultModules>;

      RedisClient.instance.on("error", (err) => RedisClient.loggingProvider.error(`Redis Client Error: ${err}`));

      RedisClient.instance.connect().catch((err) => RedisClient.loggingProvider.error(`Redis Connection Error: ${err}`));
    }

    return RedisClient.instance;
  }
}

export default RedisClient;
