"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffCriteriaSchema = exports.staffCreateRequestSchema = exports.staffCreateSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.staffCreateSchema = zod_1.z.object({
    userId: zod_1.z.number().int("User ID must be an integer").optional(),
    jobTitle: zod_1.z.string().min(1, "Job title is required"),
    roleId: zod_1.z.number().int("Role list ID must be an integer").optional(),
    groupIds: zod_1.z.array(zod_1.z.number().int("Department ID must be an integer")).optional(),
    classIds: zod_1.z.array(zod_1.z.number().int("Department ID must be an integer")).optional(),
    subjectIds: zod_1.z.array(zod_1.z.number().int("Department ID must be an integer")).optional(),
});
exports.staffCreateRequestSchema = zod_1.z.object({
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }).positive("Tenant ID must be a positive number"),
    firstName: zod_1.z.string({ required_error: "First name is required", invalid_type_error: "First name must be a string" }).min(1, "First name is required").max(50, "First name must be less than 50 characters"),
    lastName: zod_1.z.string({ required_error: "Last name is required", invalid_type_error: "Last name must be a string" }).min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
    email: zod_1.z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email("Invalid email address"),
    phoneNumber: zod_1.z.string({ required_error: "Phone number is required", invalid_type_error: "Phone number must be a string" }),
    gender: zod_1.z.string({ required_error: "Gender is required", invalid_type_error: "Gender must be a string" }),
    nin: zod_1.z.string({ required_error: "Nin is required", invalid_type_error: "Nin must be a string" }),
    dateOfBirth: zod_1.z
        .string({
        invalid_type_error: "Date of birth must be a valid Date string",
    })
        .optional()
        .refine((val) => {
        if (!val)
            return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
    }, {
        message: "Invalid date of birth format",
    })
        .transform((val) => {
        if (!val)
            return null;
        const date = new Date(val);
        return date;
    }),
    jobTitle: zod_1.z.string({ required_error: "Job title is required", invalid_type_error: "Job title must be a string" }).min(1, "Job title is required").max(100, "Job title must be less than 100 characters"),
    // roleId: z.number({ required_error: "Role ID is required", invalid_type_error: "Role ID must be a number" }).positive("Role ID must be a positive number"),
    residentialAddress: zod_1.z.string().optional(),
    residentialStateId: zod_1.z.number({ invalid_type_error: "State ID must be a number" }).optional(),
    residentialLgaId: zod_1.z.number({ invalid_type_error: "LGA ID must be a number" }).optional(),
    residentialCountryId: zod_1.z.number({ invalid_type_error: "Country ID must be a number" }).optional(),
    residentialZipCode: zod_1.z.number({ invalid_type_error: "Zip Code must be a number" }).optional(),
    employmentType: zod_1.z.nativeEnum(client_1.StaffEmploymentType, { invalid_type_error: "Invalid employment type" }).optional(),
    startDate: zod_1.z
        .string({
        invalid_type_error: "Start date must be a valid Date object",
    })
        .optional()
        .refine((val) => {
        if (!val)
            return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
    }, {
        message: "Invalid start date format",
    })
        .transform((val) => {
        if (!val)
            return null;
        const date = new Date(val);
        return date;
    }),
    // nin: z
    //   .string({ required_error: "NIN is required", invalid_type_error: "NIN must be a string" })
    //   .length(11, "NIN must be exactly 11 digits long")
    //   .regex(/^\d{11}$/, "NIN must contain only digits")
    //   .optional(),
    tin: zod_1.z.string({ invalid_type_error: "TIN must be a string" }).optional(),
    highestLevelEdu: zod_1.z.string({ invalid_type_error: "Education level must be a string" }).optional(),
    cvUrl: zod_1.z.string({ invalid_type_error: "CV URL must be a string" }).optional(),
    subjectIds: zod_1.z.array(zod_1.z.number().int("Subject ID must be an integer")).optional(),
    classIds: zod_1.z.array(zod_1.z.number().int("Class ID must be an integer")).optional(),
});
exports.staffCriteriaSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(),
    roleId: zod_1.z.string().optional(),
    jobTitle: zod_1.z.string().optional(),
});
//# sourceMappingURL=StaffCreateSchema.js.map