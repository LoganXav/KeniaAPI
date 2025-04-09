"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classReadSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.classReadSchema = zod_1.z.object({
    userId: zod_1.z.number({ required_error: "Auth User ID is required" }),
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required" }),
    type: zod_1.z.nativeEnum(client_1.ClassList).optional(),
});
//# sourceMappingURL=ClassReadSchema.js.map