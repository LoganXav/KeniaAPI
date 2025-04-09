"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalHistoryCreateSchema = void 0;
const zod_1 = require("zod");
exports.medicalHistoryCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
    studentId: zod_1.z.number().min(1, "Student ID is required"),
    tenantId: zod_1.z.number().min(1, "Tenant ID is required"),
});
//# sourceMappingURL=MedicalHistoryCreateSchema.js.map