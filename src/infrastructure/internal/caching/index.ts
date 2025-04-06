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
        socket: {
          connectTimeout: 10000, // Set a reasonable timeout
        },
      }) as RedisClientType<RedisDefaultModules>;

      // Log Redis connection errors
      RedisClient.instance.on("error", (err) => {
        RedisClient.loggingProvider.error(`Redis Client Error: ${err}`);
      });

      // Connect to Redis and handle any connection issues
      RedisClient.instance.connect().catch((err) => {
        RedisClient.loggingProvider.error(`Redis Connection Error: ${err}`);
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
