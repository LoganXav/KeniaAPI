"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentCreateSchema = void 0;
const zod_1 = require("zod");
exports.documentCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    url: zod_1.z.string().min(1, "URL is required"),
    studentId: zod_1.z.number().optional(),
    documentTypeId: zod_1.z.number().min(1, "Document Type ID is required"),
    tenantId: zod_1.z.number().min(1, "Tenant ID is required"),
});
//# sourceMappingURL=DocumentCreateSchema.js.map