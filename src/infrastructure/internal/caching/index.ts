import AppSettings from "~/api/shared/setttings/AppSettings";
import { createClient, RedisClientType, RedisDefaultModules } from "redis";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

class RedisClient {
  private static instance: RedisClientType<RedisDefaultModules>;
  private static loggingProvider: ILoggingDriver = LoggingProviderFactory.build();

  private constructor() {}

  public static getInstance(): RedisClientType<RedisDefaultModules> {
    if (!RedisClient.instance) {
      RedisClient.instance = createClient({
        url: AppSettings.getCacheUrl(),
        socket: {
          connectTimeout: 10000,
        },
      }) as RedisClientType<RedisDefaultModules>;

      // Connect to Redis and handle any connection issues
      RedisClient.instance.connect().catch((err) => {
        RedisClient.loggingProvider.error(`Redis Connection Error: ${err}`);
      });

      RedisClient.instance.on("connect", () => {
        RedisClient.loggingProvider.info("Redis connection successful.");
      });

      // Log Redis connection errors
      RedisClient.instance.on("error", (err) => {
        RedisClient.loggingProvider.error(`Redis Client Error: ${err}`);
      });

      // Optionally handle retry logic if you want to implement automatic retries on failure
      RedisClient.instance.on("end", () => {
        RedisClient.loggingProvider.info("Redis connection ended.");
      });
    }

    return RedisClient.instance;
  }
}

export default RedisClient;
