"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupSchema = void 0;
const zod_1 = require("zod");
exports.createGroupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    tenantId: zod_1.z.number().int("Tenant ID must be an integer"),
});
//# sourceMappingURL=GroupCreateSchema.js.map