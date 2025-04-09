"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentTypeUpdateSchema = void 0;
const zod_1 = require("zod");
exports.documentTypeUpdateSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1).optional(),
    tenantId: zod_1.z.number().optional(),
});
//# sourceMappingURL=DocumentTypeUpdateSchema.js.map