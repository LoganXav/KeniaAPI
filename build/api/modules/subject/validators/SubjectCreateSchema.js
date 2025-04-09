"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectCreateSchema = void 0;
const zod_1 = require("zod");
exports.subjectCreateSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    description: zod_1.z.string().optional(),
    classDivisionIds: zod_1.z.array(zod_1.z.number()).optional(),
    staffIds: zod_1.z.array(zod_1.z.number()).optional(),
    classId: zod_1.z.number({ required_error: "Class ID is required", invalid_type_error: "Class ID must be a number" }),
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }),
    userId: zod_1.z.number({ required_error: "Auth User ID is required" }),
});
//# sourceMappingURL=SubjectCreateSchema.js.map