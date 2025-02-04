import { autoInjectable } from "tsyringe";
import RedisClient from "~/infrastructure/internal/caching";
import { RedisClientType } from "redis";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import ArrayUtil from "~/utils/ArrayUtil";
import UserReadProvider from "../providers/UserRead.provider";
import { ReadUserRecordType, UserWithRelations } from "../types/UserTypes";

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

  public async getAll(tenantId: number): Promise<UserWithRelations[] | null> {
    try {
      const cacheKey = `${tenantId}:user:all`;
      const cachedUsers = await this.redisClient.get(cacheKey);

      if (cachedUsers) {
        console.log("All User Cache HIT!");
        return JSON.parse(cachedUsers);
      }

      const users = await this.userReadProvider.getAll();
      console.log("All User Cache MISS!");

      if (ArrayUtil.any(users)) {
        await this.redisClient.set(cacheKey, JSON.stringify(users), {
          EX: this.CACHE_EXPIRY,
        });
      }

      return users;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria({ tenantId, criteria }: { tenantId: number; criteria: ReadUserRecordType }): Promise<UserWithRelations | null> {
    try {
      const cacheKey = `${tenantId}:user:${JSON.stringify(criteria)}`;

      const cachedUser = await this.redisClient.get(cacheKey);

      if (cachedUser) {
        console.log("Criteria User Cache HIT!");
        return JSON.parse(cachedUser);
      }

      const user = await this.userReadProvider.getOneByCriteria(criteria);
      console.log("Criteria User Cache MISS!");

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
      // Delete global user cache
      await this.redisClient.del(`${tenantId}:user:all`);
      console.log("All User Cache CLEARED!");

      // Find all keys matching criteria-based caches and delete them
      const keys = await this.redisClient.keys(`${tenantId}:user:*`);

      if (ArrayUtil.any(keys)) {
        await this.redisClient.del(keys);
        console.log("Criteria User Cache CLEARED!");
      }
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async update(tenantId: number, updatedUser: UserWithRelations): Promise<void> {
    try {
      const cacheKey = `${tenantId}:user:all`;
      const cachedUsers = await this.redisClient.get(cacheKey);

      if (cachedUsers) {
        console.log("All User Cache HIT!");
        const usersList = JSON.parse(cachedUsers);
        const index = usersList.findIndex((user: UserWithRelations) => user.id === updatedUser.id);

        if (index !== -1) {
          usersList[index] = updatedUser;
          await this.redisClient.set(cacheKey, JSON.stringify(usersList), {
            EX: this.CACHE_EXPIRY,
          });
          console.log("All User Cache UPDATED!");
        }
      }

      // Invalidate all criteria-based caches
      const keys = await this.redisClient.keys(`${tenantId}:user:*`);
      if (ArrayUtil.any(keys)) {
        await this.redisClient.del(keys);
        console.log("Criteria User Cache CLEARED!");
      }
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
