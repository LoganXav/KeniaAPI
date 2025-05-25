import { Class } from "@prisma/client";
import { RedisClientType } from "redis";
import ArrayUtil from "~/utils/ArrayUtil";
import { autoInjectable } from "tsyringe";
import RedisClient from "~/infrastructure/internal/caching";
import { ClassCriteriaType } from "~/api/modules/class/types/ClassTypes";
import ClassReadProvider from "~/api/modules/class/providers/ClassRead.provider";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@autoInjectable()
export default class ClassReadCache {
  static cacheName = "ClassReadCache";
  classReadProvider: ClassReadProvider;
  redisClient: RedisClientType;
  private CACHE_EXPIRY = 60 * 5;

  constructor(classReadProvider: ClassReadProvider) {
    this.redisClient = RedisClient.getInstance();
    this.classReadProvider = classReadProvider;
  }

  public async getByCriteria(criteria: ClassCriteriaType): Promise<Class[] | null> {
    try {
      const cacheKey = `${criteria.tenantId}:class:${JSON.stringify(criteria)}`;
      const cachedClasses = await this.redisClient.get(cacheKey);

      if (cachedClasses) {
        return JSON.parse(cachedClasses);
      }

      const classes = await this.classReadProvider.getByCriteria(criteria);

      if (ArrayUtil.any(classes)) {
        await this.redisClient.set(cacheKey, JSON.stringify(classes), {
          EX: this.CACHE_EXPIRY,
        });
      }

      return classes;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async invalidate(tenantId: number): Promise<void> {
    try {
      // Find all keys matching criteria-based caches and delete them
      const keys = await this.redisClient.keys(`${tenantId}:class:*`);
      if (ArrayUtil.any(keys)) {
        await this.redisClient.del(keys);
      }
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: ClassCriteriaType): Promise<Class | null> {
    try {
      const { tenantId } = criteria;
      const cacheKey = `${tenantId}:class:${JSON.stringify(criteria)}`;
      const cachedClass = await this.redisClient.get(cacheKey);

      if (cachedClass) {
        return JSON.parse(cachedClass);
      }

      const _class = await this.classReadProvider.getOneByCriteria(criteria);

      if (_class) {
        await this.redisClient.set(cacheKey, JSON.stringify(_class), {
          EX: this.CACHE_EXPIRY,
        });
      }

      return _class;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
