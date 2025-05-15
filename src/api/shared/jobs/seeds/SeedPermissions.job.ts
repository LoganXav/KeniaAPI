import { Job } from "bullmq";
import { JobResult } from "~/infrastructure/internal/queue";
import { PERMISSIONS } from "~/api/shared/helpers/constants/Permissions.constants";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import PermissionCreateProvider from "~/api/modules/permission/providers/PermissionCreate.provider";

export interface SeedPermissionsJobData {
  tenantId: number;
}

export class SeedPermissionsJob {
  private static loggingProvider = LoggingProviderFactory.build();
  private static permissionCreateProvider = new PermissionCreateProvider();

  public static async process(job: Job<SeedPermissionsJobData, JobResult>): Promise<JobResult> {
    try {
      const { tenantId } = job.data;

      const defaultPermissions = Object.values(PERMISSIONS)
        .flatMap((resource) => Object.values(resource))
        .map((name) => ({
          name,
          tenantId,
        }));

      await SeedPermissionsJob.permissionCreateProvider.createMany(defaultPermissions);

      return {
        status: "completed",
        data: {
          tenantId,
          permissionsCreated: defaultPermissions.length,
        },
      };
    } catch (error: any) {
      SeedPermissionsJob.loggingProvider.error(`Failed to seed permissions for TENANTID - ${job.data.tenantId}: ${error}`);
      throw new InternalServerError(error);
    }
  }
}
