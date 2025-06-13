import { RedisClientType } from "redis";
import ArrayUtil from "~/utils/ArrayUtil";
import { autoInjectable } from "tsyringe";
import RedisClient from "~/infrastructure/internal/caching";
import UserReadProvider from "../providers/UserRead.provider";
import { ReadUserRecordType, UserWithRelationsAndPermissions } from "../types/UserTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@autoInjectable()
export default class UserReadCache {
  static cacheName = "UserReadCache";
  userReadProvider: UserReadProvider;
  redisClient: RedisClientType;
  private CACHE_EXPIRY = 60 * 5;

  constructor(userReadProvider: UserReadProvider) {
    this.redisClient = RedisClient.getInstance();
    this.userReadProvider = userReadProvider;
  }

  public async getOneByCriteria(criteria: ReadUserRecordType): Promise<UserWithRelationsAndPermissions | null> {
    try {
      const { tenantId } = criteria;
      const cacheKey = `${tenantId}:user:${JSON.stringify(criteria)}`;

      const cachedUser = await this.redisClient.get(cacheKey);

      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      const user = await this.userReadProvider.getOneByCriteria(criteria);

      if (user) {
        await this.redisClient.set(cacheKey, JSON.stringify(user), {
          EX: this.CACHE_EXPIRY,
        });
      }

      return user;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async invalidate(tenantId: number): Promise<void> {
    try {
      // Find all keys matching criteria-based caches and delete them
      const keys = await this.redisClient.keys(`${tenantId}:user:*`);

      if (ArrayUtil.any(keys)) {
        await this.redisClient.del(keys);
      }
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
