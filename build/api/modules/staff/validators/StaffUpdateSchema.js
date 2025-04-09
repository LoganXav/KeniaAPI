"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffUpdateManySchema = exports.staffUpdateSchema = void 0;
const z = __importStar(require("zod"));
const client_1 = require("@prisma/client");
exports.staffUpdateSchema = z.object({
    tenantId: z.number({ required_error: "Tenant Id is required" }),
    userId: z.number({ required_error: "Auth User Id is required" }),
    id: z.number({ required_error: "Staff User Id is required" }),
    jobTitle: z.string().optional(),
    roleId: z.number().optional(),
    cvUrl: z.string().optional(),
    residentialCountryId: z.number().optional(),
    residentialAddress: z.string().optional(),
    residentialStateId: z.number().optional(),
    residentialLgaId: z.number().optional(),
    residentialZipCode: z.number().optional(),
    employmentType: z.nativeEnum(client_1.StaffEmploymentType, { invalid_type_error: "Invalid employment type" }).optional(),
    startDate: z
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
    highestLevelEdu: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    gender: z.string().optional(),
    email: z.string().optional(),
    dateOfBirth: z
        .string({
        invalid_type_error: "Date of birth must be a valid Date object",
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
    nin: z.string().optional(),
    tin: z.string().optional(),
    subjectIds: z.array(z.number().int("Subject ID must be an integer")).optional(),
    classIds: z.array(z.number().int("Class ID must be an integer")).optional(),
});
exports.staffUpdateManySchema = z.object({
    tenantId: z.number({ required_error: "Tenant Id is required" }),
    ids: z.array(z.number({
        required_error: "Argument ids is missing",
    })),
    jobTitle: z.string().optional(),
    roleId: z.number().optional(),
});
//# sourceMappingURL=StaffUpdateSchema.js.map