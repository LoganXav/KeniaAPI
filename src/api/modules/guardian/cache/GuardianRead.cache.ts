import { RedisClientType } from "redis";
import ArrayUtil from "~/utils/ArrayUtil";
import { autoInjectable } from "tsyringe";
import { Guardian } from "@prisma/client";
import RedisClient from "~/infrastructure/internal/caching";
import { GuardianCriteriaType } from "../types/GuardianTypes";
import GuardianReadProvider from "../providers/GuardianRead.provider";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@autoInjectable()
export default class GuardianReadCache {
  static cacheName = "GuardianReadCache";
  guardianReadProvider: GuardianReadProvider;
  redisClient: RedisClientType;
  private CACHE_EXPIRY = 60 * 5;

  constructor(guardianReadProvider: GuardianReadProvider) {
    this.redisClient = RedisClient.getInstance();
    this.guardianReadProvider = guardianReadProvider;
  }

  public async getByCriteria(criteria: GuardianCriteriaType): Promise<Guardian[] | null> {
    try {
      const cacheKey = `${criteria.tenantId}:guardian:${JSON.stringify(criteria)}`;
      const cachedGuardians = await this.redisClient.get(cacheKey);

      if (cachedGuardians) {
        return JSON.parse(cachedGuardians);
      }

      const guardians = await this.guardianReadProvider.getByCriteria(criteria);

      if (ArrayUtil.any(guardians)) {
        await this.redisClient.set(cacheKey, JSON.stringify(guardians), {
          EX: this.CACHE_EXPIRY,
        });
      }

      return guardians;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async invalidate(tenantId: number): Promise<void> {
    try {
      // Find all keys matching criteria-based caches and delete them
      const keys = await this.redisClient.keys(`${tenantId}:guardian:*`);
      if (ArrayUtil.any(keys)) {
        await this.redisClient.del(keys);
      }
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: GuardianCriteriaType): Promise<Guardian | null> {
    try {
      const { tenantId } = criteria;
      const cacheKey = `${tenantId}:guardian:${JSON.stringify(criteria)}`;
      const cachedGuardian = await this.redisClient.get(cacheKey);

      if (cachedGuardian) {
        return JSON.parse(cachedGuardian);
      }

      const guardian = await this.guardianReadProvider.getOneByCriteria(criteria);

      if (guardian) {
        await this.redisClient.set(cacheKey, JSON.stringify(guardian), {
          EX: this.CACHE_EXPIRY,
        });
      }

      return guardian;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
