"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffReadOneParamsSchema = exports.staffReadParamsSchema = void 0;
const zod_1 = require("zod");
exports.staffReadParamsSchema = zod_1.z.object({
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be an integer" }),
    userId: zod_1.z.number({ required_error: "Auth User ID is required", invalid_type_error: "Auth User ID must be an integer" }),
    ids: zod_1.z.array(zod_1.z.string()).optional(),
    jobTitle: zod_1.z.string().optional(),
});
exports.staffReadOneParamsSchema = zod_1.z.object({
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be an integer" }),
    userId: zod_1.z.number({ required_error: "Auth User ID is required", invalid_type_error: "Auth User ID must be an integer" }),
});
//# sourceMappingURL=StaffReadSchema.js.map