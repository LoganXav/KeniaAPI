import { autoInjectable } from "tsyringe";
import StudentReadProvider from "../providers/StudentRead.provider";
import { Student } from "@prisma/client";
import RedisClient from "~/infrastructure/internal/caching";
import { RedisClientType } from "redis";
import { StudentCriteriaType } from "../types/StudentTypes";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import ArrayUtil from "~/utils/ArrayUtil";

@autoInjectable()
export default class StudentReadCache {
  static cacheName = "StudentReadCache";
  studentReadProvider: StudentReadProvider;
  redisClient: RedisClientType;
  private CACHE_EXPIRY = 60 * 5;

  constructor(studentReadProvider: StudentReadProvider) {
    this.redisClient = RedisClient.getInstance();
    this.studentReadProvider = studentReadProvider;
  }

  public async getByCriteria(criteria: StudentCriteriaType): Promise<Student[] | null> {
    try {
      const cacheKey = `${criteria.tenantId}:student:${JSON.stringify(criteria)}`;
      const cachedStudents = await this.redisClient.get(cacheKey);

      if (cachedStudents) {
        // console.log("Criteria Student Cache HIT!");
        return JSON.parse(cachedStudents);
      }

      const students = await this.studentReadProvider.getByCriteria(criteria);

      // console.log("Criteria Student Cache MISS!");

      if (ArrayUtil.any(students)) {
        await this.redisClient.set(cacheKey, JSON.stringify(students), {
          EX: this.CACHE_EXPIRY,
        });
      }

      return students;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async invalidate(tenantId: number): Promise<void> {
    try {
      const keys = await this.redisClient.keys(`${tenantId}:student:*`);
      if (ArrayUtil.any(keys)) {
        await this.redisClient.del(keys);
        console.log("Criteria Student Cache CLEARED!");
      }
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: StudentCriteriaType): Promise<Student | null> {
    try {
      const cacheKey = `${criteria.tenantId}:singleStudent:${JSON.stringify(criteria)}`;
      const cachedStudent = await this.redisClient.get(cacheKey);

      if (cachedStudent) {
        console.log("Criteria Single Student Cache HIT!");
        return JSON.parse(cachedStudent);
      }

      const student = await this.studentReadProvider.getOneByCriteria(criteria);
      console.log("Criteria Single Student Cache MISS!");

      if (student) {
        await this.redisClient.set(cacheKey, JSON.stringify(student), {
          EX: this.CACHE_EXPIRY,
        });
      }

      return student;
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }
}
