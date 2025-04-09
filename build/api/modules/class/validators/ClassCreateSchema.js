"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classCreateSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.classCreateSchema = zod_1.z.object({
    // name: z.string().min(1, "Name is required"),
    type: zod_1.z.nativeEnum(client_1.ClassList),
    classTeacherId: zod_1.z.number().optional(),
    tenantId: zod_1.z.number().optional(),
});
//# sourceMappingURL=ClassCreateSchema.js.map