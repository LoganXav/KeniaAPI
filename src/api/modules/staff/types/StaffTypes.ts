import { z } from "zod";
import { createStaffSchema } from "../validators/StaffCreateSchema";

export type CreateStaffData = z.infer<typeof createStaffSchema>;

export interface StaffCriteria {
  id?: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  jobTitle?: string;
  roleListId?: number;
  departmentId?: number;
  tenantId?: number;
}

export interface UpdateStaffData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    jobTitle?: string;
    roleListId?: number;
    tenantId?: number;
  }
