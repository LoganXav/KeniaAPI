"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classDivisionReadSchema = void 0;
const zod_1 = require("zod");
exports.classDivisionReadSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    ids: zod_1.z.array(zod_1.z.number()).optional(),
    name: zod_1.z.string().optional(),
    classId: zod_1.z.number().optional(),
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required" }),
    userId: zod_1.z.number({ required_error: "Auth User ID is required" }),
});
//# sourceMappingURL=ClassDivisionReadSchema.js.map