import { RedisClientType } from "redis";
import { Student } from "@prisma/client";
import { autoInjectable } from "tsyringe";
import ArrayUtil from "~/utils/ArrayUtil";
import { StudentCriteriaType } from "../types/StudentTypes";
import RedisClient from "~/infrastructure/internal/caching";
import StudentReadProvider from "../providers/StudentRead.provider";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";

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
        return JSON.parse(cachedStudents);
      }

      const students = await this.studentReadProvider.getByCriteria(criteria);

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
      }
    } catch (error: any) {
      throw new InternalServerError(error);
    }
  }

  public async getOneByCriteria(criteria: StudentCriteriaType): Promise<Student | null> {
    try {
      const cacheKey = `${criteria.tenantId}:student:${JSON.stringify(criteria)}`;
      const cachedStudent = await this.redisClient.get(cacheKey);

      if (cachedStudent) {
        return JSON.parse(cachedStudent);
      }

      const student = await this.studentReadProvider.getOneByCriteria(criteria);

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
