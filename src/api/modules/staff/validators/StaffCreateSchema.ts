import { z } from 'zod';

export const createStaffSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  jobTitle: z.string().min(1, "Job title is required"),
  roleListId: z.number().int("Role list ID must be an integer"),
  departmentIds: z.array(z.number().int("Department ID must be an integer")),
  tenantId: z.number().int("Tenant ID must be an integer"),
});

