"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classUpdateSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.classUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    type: zod_1.z.nativeEnum(client_1.ClassList).optional(),
    classTeacherId: zod_1.z.number().optional(),
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required" }),
    userId: zod_1.z.number({ required_error: "Auth User ID is required" }),
});
//# sourceMappingURL=ClassUpdateSchema.js.map