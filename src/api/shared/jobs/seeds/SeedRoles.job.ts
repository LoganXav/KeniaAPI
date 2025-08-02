import { Job } from "bullmq";
import { JobResult } from "~/infrastructure/internal/queue";
import { PERMISSIONS } from "../../helpers/constants/Permissions.constants";
import RoleCreateProvider from "~/api/modules/role/providers/RoleCreate.provider";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import PermissionReadProvider from "~/api/modules/permission/providers/PermissionRead.provider";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";

export interface SeedRolesJobData {
  tenantId: number;
  staffId: number;
  userId: number;
}

export class SeedRolesJob {
  private static loggingProvider = LoggingProviderFactory.build();
  private static roleCreateProvider = new RoleCreateProvider();
  private static permissionReadProvider = new PermissionReadProvider();

  public static async process(job: Job<SeedRolesJobData, JobResult>): Promise<JobResult> {
    try {
      const { tenantId, staffId } = job.data;

      const allPermissions = await SeedRolesJob.permissionReadProvider.getByCriteria({ tenantId });

      const getIds = (keys: string[]) => {
        return allPermissions.filter((p) => keys.includes(p.name)).map((p) => p.id);
      };

      const rolesToSeed = [
        {
          name: "School System Administrator",
          description: "Has unrestricted access to all system features, including user management, academic settings, and operational configurations.",
          isAdmin: true,
          permissionKeys: allPermissions.map((p) => p.name),
          staffIds: [staffId],
        },
        {
          name: "Academic Staff (Teacher)",
          description: "Access to student information, assigned subjects, classes, academic calendar, and timetable for teaching and instructional purposes.",
          isAdmin: false,
          permissionKeys: [PERMISSIONS.STUDENT.READ, PERMISSIONS.TIMETABLE.READ, PERMISSIONS.CALENDAR.READ, PERMISSIONS.CLASS.READ, PERMISSIONS.SUBJECT.READ, PERMISSIONS.PERIOD.READ],
          staffIds: [],
        },
        {
          name: "ICT & Role Manager",
          description: "Responsible for managing access control, user roles, academic calendars, and timetables across the institution.",
          isAdmin: false,
          permissionKeys: [
            PERMISSIONS.ROLE.CREATE,
            PERMISSIONS.ROLE.READ,
            PERMISSIONS.ROLE.UPDATE,
            PERMISSIONS.ROLE.DELETE,
            PERMISSIONS.TIMETABLE.CREATE,
            PERMISSIONS.TIMETABLE.READ,
            PERMISSIONS.TIMETABLE.UPDATE,
            PERMISSIONS.TIMETABLE.DELETE,
            PERMISSIONS.CALENDAR.CREATE,
            PERMISSIONS.CALENDAR.READ,
            PERMISSIONS.CALENDAR.UPDATE,
            PERMISSIONS.CALENDAR.DELETE,
          ],
          staffIds: [],
        },
        {
          name: "Records & Registry Clerk",
          description: "Handles the creation and maintenance of staff and student records, with full access to administrative data entry operations.",
          isAdmin: false,
          permissionKeys: [PERMISSIONS.STAFF.CREATE, PERMISSIONS.STAFF.READ, PERMISSIONS.STAFF.UPDATE, PERMISSIONS.STAFF.DELETE, PERMISSIONS.STUDENT.CREATE, PERMISSIONS.STUDENT.READ, PERMISSIONS.STUDENT.UPDATE, PERMISSIONS.STUDENT.DELETE],
          staffIds: [],
        },
      ];

      await Promise.all(
        rolesToSeed.map((role) =>
          SeedRolesJob.roleCreateProvider.createRole({
            tenantId,
            name: role.name,
            description: role.description,
            isAdmin: role.isAdmin,
            permissionIds: getIds(role.permissionKeys),
            staffIds: role.staffIds,
          })
        )
      );

      return {
        status: "completed",
        data: {
          tenantId,
          rolesCreated: rolesToSeed.length,
        },
      };
    } catch (error: any) {
      SeedRolesJob.loggingProvider.error(`Failed to assign permissions to user ${job.data.userId} for TENANTID - ${job.data.tenantId}: ${error}`);
      throw new InternalServerError(error);
    }
  }
}
