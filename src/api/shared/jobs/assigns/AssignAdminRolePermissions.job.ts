import { Job } from "bullmq";
import { JobResult } from "~/infrastructure/internal/queue";
import RoleCreateProvider from "~/api/modules/role/providers/RoleCreate.provider";
import StaffUpdateProvider from "~/api/modules/staff/providers/StaffUpdate.provider";
import { SCHOOL_OWNER_ROLE_NAME } from "~/api/shared/helpers/messages/SystemMessages";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import PermissionReadProvider from "~/api/modules/permission/providers/PermissionRead.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

export interface AssignAdminRolePermissionsJobData {
  tenantId: number;
  staffId: number;
  userId: number;
}

export class AssignAdminRolePermissionsJob {
  private static loggingProvider = LoggingProviderFactory.build();
  private static staffUpdateProvider = new StaffUpdateProvider();
  private static roleCreateProvider = new RoleCreateProvider();
  private static permissionReadProvider = new PermissionReadProvider();

  public static async process(job: Job<AssignAdminRolePermissionsJobData, JobResult>): Promise<JobResult> {
    try {
      const { tenantId, staffId, userId } = job.data;

      const permissions = await AssignAdminRolePermissionsJob.permissionReadProvider.getByCriteria({ tenantId });

      const roleCreateInput = {
        name: SCHOOL_OWNER_ROLE_NAME,
        tenantId,
        permissionIds: permissions.map((permission) => permission.id),
      };

      const role = await AssignAdminRolePermissionsJob.roleCreateProvider.createRole(roleCreateInput);

      await AssignAdminRolePermissionsJob.staffUpdateProvider.updateOne({
        tenantId,
        userId,
        id: staffId,
        roleId: role.id,
      });

      return {
        status: "completed",
        data: {
          tenantId,
          roleId: role.id,
          permissionsAssigned: permissions.length,
        },
      };
    } catch (error: any) {
      AssignAdminRolePermissionsJob.loggingProvider.error(`Failed to assign permissions to user ${job.data.userId} for TENANTID - ${job.data.tenantId}: ${error}`);
      throw new InternalServerError(error);
    }
  }
}
