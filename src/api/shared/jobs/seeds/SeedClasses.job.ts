import { Job } from "bullmq";
import { ClassList } from "@prisma/client";
import { JobResult } from "~/infrastructure/internal/queue";
import ClassReadCache from "~/api/modules/class/cache/ClassRead.cache";
import ClassReadProvider from "~/api/modules/class/providers/ClassRead.provider";
import ClassCreateProvider from "~/api/modules/class/providers/ClassCreate.provider";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

export interface SeedClassesJobData {
  tenantId: number;
}

export class SeedClassesJob {
  private static loggingProvider = LoggingProviderFactory.build();
  private static classCreateProvider = new ClassCreateProvider();
  private static classReadProvider = new ClassReadProvider();
  private static classReadCache = new ClassReadCache(SeedClassesJob.classReadProvider);

  public static async process(job: Job<SeedClassesJobData, JobResult>): Promise<JobResult> {
    try {
      const { tenantId } = job.data;

      const defaultClasses = Object.values(ClassList).map((name) => ({
        name,
        tenantId,
      }));

      await SeedClassesJob.classCreateProvider.createMany(defaultClasses);
      await SeedClassesJob.classReadCache.invalidate(tenantId);

      return {
        status: "completed",
        data: {
          tenantId,
          classesCreated: defaultClasses.length,
        },
      };
    } catch (error: any) {
      SeedClassesJob.loggingProvider.error(`Failed to seed classes for TENANTID - ${job.data.tenantId}: ${error}`);
      throw new InternalServerError(error);
    }
  }
}
