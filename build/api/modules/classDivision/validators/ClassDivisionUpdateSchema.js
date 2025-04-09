"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classDivisionUpdateSchema = void 0;
const zod_1 = require("zod");
exports.classDivisionUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    classId: zod_1.z.number().optional(),
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required" }),
    userId: zod_1.z.number({ required_error: "Auth User ID is required" }),
});
//# sourceMappingURL=ClassDivisionUpdateSchema.js.map