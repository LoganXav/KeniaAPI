import { autoInjectable } from "tsyringe";
import StaffReadProvider from "../providers/StaffRead.provider";
import { Staff } from "@prisma/client";
import RedisClient from "~/infrastructure/internal/caching";
import { RedisClientType } from "redis";
import { StaffCriteriaType } from "../types/StaffTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import ArrayUtil from "~/utils/ArrayUtil";

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

  public async getByCriteria(criteria: StaffCriteriaType): Promise<Staff[] | null> {
    try {
      const cacheKey = `${criteria.tenantId}:staff:${JSON.stringify(criteria)}`;
      const cachedStaffs = await this.redisClient.get(cacheKey);

      if (cachedStaffs) {
        console.log("Criteria Staff Cache HIT!");
        return JSON.parse(cachedStaffs);
      }

      const staffs = await this.staffReadProvider.getByCriteria(criteria);
      console.log("Criteria Staff Cache MISS!");

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
        console.log("Criteria Staff Cache CLEARED!");
      }
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: StaffCriteriaType): Promise<Staff | null> {
    try {
      const { tenantId } = criteria;
      const cacheKey = `${tenantId}:staff:${JSON.stringify(criteria)}`;
      const cachedStaff = await this.redisClient.get(cacheKey);

      if (cachedStaff) {
        console.log("Criteria Single Staff Cache HIT!");
        return JSON.parse(cachedStaff);
      }

      const staff = await this.staffReadProvider.getOneByCriteria(criteria);
      console.log("Criteria Single Staff Cache MISS!");

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
