import { Staff } from "@prisma/client";
import { RedisClientType } from "redis";
import ArrayUtil from "~/utils/ArrayUtil";
import { autoInjectable } from "tsyringe";
import RedisClient from "~/infrastructure/internal/caching";
import StaffReadProvider from "../providers/StaffRead.provider";
import { StaffCriteriaType, StaffWithRelationsType } from "../types/StaffTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

@autoInjectable()
export default class StaffReadCache {
  static cacheName = "StaffReadCache";
  staffReadProvider: StaffReadProvider;
  redisClient: RedisClientType;
  private CACHE_EXPIRY = 60 * 5;

  constructor(staffReadProvider: StaffReadProvider) {
    this.redisClient = RedisClient.getInstance();
    this.staffReadProvider = staffReadProvider;
  }

  public async getByCriteria(criteria: StaffCriteriaType): Promise<StaffWithRelationsType[] | null> {
    try {
      const cacheKey = `${criteria.tenantId}:staff:${JSON.stringify(criteria)}`;
      const cachedStaffs = await this.redisClient.get(cacheKey);

      if (cachedStaffs) {
        return JSON.parse(cachedStaffs);
      }

      const staffs = await this.staffReadProvider.getByCriteria(criteria);

      if (ArrayUtil.any(staffs)) {
        await this.redisClient.set(cacheKey, JSON.stringify(staffs), {
          EX: this.CACHE_EXPIRY,
        });
      }

      return staffs;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async invalidate(tenantId: number): Promise<void> {
    try {
      // Find all keys matching criteria-based caches and delete them
      const keys = await this.redisClient.keys(`${tenantId}:staff:*`);
      if (ArrayUtil.any(keys)) {
        await this.redisClient.del(keys);
      }
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: StaffCriteriaType): Promise<StaffWithRelationsType | null> {
    try {
      const { tenantId } = criteria;
      const cacheKey = `${tenantId}:staff:${JSON.stringify(criteria)}`;
      const cachedStaff = await this.redisClient.get(cacheKey);

      if (cachedStaff) {
        return JSON.parse(cachedStaff);
      }

      const staff = await this.staffReadProvider.getOneByCriteria(criteria);

      if (staff) {
        await this.redisClient.set(cacheKey, JSON.stringify(staff), {
          EX: this.CACHE_EXPIRY,
        });
      }

      return staff;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
