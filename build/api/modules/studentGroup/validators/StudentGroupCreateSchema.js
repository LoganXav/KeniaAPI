"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentGroupCreateSchema = void 0;
const zod_1 = require("zod");
exports.studentGroupCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    tenantId: zod_1.z.number().min(1, "Tenant ID is required"),
});
//# sourceMappingURL=StudentGroupCreateSchema.js.map