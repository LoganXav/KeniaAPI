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

  public async getAll(tenantId: number): Promise<Staff[] | null> {
    try {
      const cacheKey = `${tenantId}:staff:all`;
      const cachedStaffs = await this.redisClient.get(cacheKey);

      if (cachedStaffs) {
        console.log("All Staff Cache HIT!");
        return JSON.parse(cachedStaffs);
      }

      const staffs = await this.staffReadProvider.getAllStaff();
      console.log("All Staff Cache MISS!");

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

  public async getByCriteria({ tenantId, criteria }: { tenantId: number; criteria: StaffCriteriaType }): Promise<Staff[] | null> {
    try {
      const cacheKey = `${tenantId}:staff:${JSON.stringify(criteria)}`;
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
      // Delete global staff cache
      await this.redisClient.del(`${tenantId}:staff:all`);
      console.log("All Staff Cache CLEARED!");

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

  public async update(tenantId: number, updatedStaff: Staff): Promise<void> {
    try {
      const cacheKey = `${tenantId}:staff:all`;
      const cachedStaffs = await this.redisClient.get(cacheKey);

      if (cachedStaffs) {
        const staffList = JSON.parse(cachedStaffs);
        const index = staffList.findIndex((staff: Staff) => staff.id === updatedStaff.id);

        if (index !== -1) {
          staffList[index] = updatedStaff;
          await this.redisClient.set(cacheKey, JSON.stringify(staffList), {
            EX: this.CACHE_EXPIRY,
          });
        }
      }

      // Invalidate all criteria-based caches
      const keys = await this.redisClient.keys(`${tenantId}:staff:*`);
      if (ArrayUtil.any(keys)) {
        await this.redisClient.del(keys);
      }
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
