"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentTypeCreateSchema = void 0;
const zod_1 = require("zod");
exports.documentTypeCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    tenantId: zod_1.z.number().optional(),
});
//# sourceMappingURL=DocumentTypeCreateSchema.js.map