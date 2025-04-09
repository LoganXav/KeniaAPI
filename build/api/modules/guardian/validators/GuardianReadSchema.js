"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardianReadSchema = void 0;
const zod_1 = require("zod");
exports.guardianReadSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    ids: zod_1.z.array(zod_1.z.number()).optional(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    tenantId: zod_1.z.number().optional(),
    studentIds: zod_1.z.array(zod_1.z.number()).optional(),
});
//# sourceMappingURL=GuardianReadSchema.js.map