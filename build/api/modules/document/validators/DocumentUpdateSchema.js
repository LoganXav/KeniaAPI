"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentUpdateSchema = void 0;
const zod_1 = require("zod");
exports.documentUpdateSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1).optional(),
    studentId: zod_1.z.number().optional(),
    url: zod_1.z.string().min(1).optional(),
    documentTypeId: zod_1.z.number().optional(),
    tenantId: zod_1.z.number().optional(),
});
//# sourceMappingURL=DocumentUpdateSchema.js.map