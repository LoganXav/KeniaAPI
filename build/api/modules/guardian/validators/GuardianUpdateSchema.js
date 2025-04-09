"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardianUpdateSchema = void 0;
const zod_1 = require("zod");
exports.guardianUpdateSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1).optional(),
    phone: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email("Invalid email format").optional(),
    address: zod_1.z.string().min(1).optional(),
    studentIds: zod_1.z.array(zod_1.z.number().int("Student ID must be an integer")).optional(),
    tenantId: zod_1.z.number().optional(),
});
//# sourceMappingURL=GuardianUpdateSchema.js.map