"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentReadOneParamsSchema = exports.studentReadSchema = void 0;
const zod_1 = require("zod");
exports.studentReadSchema = zod_1.z.object({
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be an integer" }),
    userId: zod_1.z.number({ required_error: "Auth User ID is required", invalid_type_error: "Auth User ID must be an integer" }),
    ids: zod_1.z.array(zod_1.z.number()).optional(),
    classId: zod_1.z.number({ invalid_type_error: "Class ID must be an integer" }).optional(),
    dormitoryId: zod_1.z.number({ invalid_type_error: "Dormitory ID must be an integer" }).optional(),
});
exports.studentReadOneParamsSchema = zod_1.z.object({
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be an integer" }),
    userId: zod_1.z.number({ required_error: "Auth User ID is required", invalid_type_error: "Auth User ID must be an integer" }),
});
//# sourceMappingURL=StudentReadSchema.js.map