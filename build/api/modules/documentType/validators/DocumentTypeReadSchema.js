"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentTypeReadSchema = void 0;
const zod_1 = require("zod");
exports.documentTypeReadSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    ids: zod_1.z.array(zod_1.z.number()).optional(),
    name: zod_1.z.string().optional(),
    tenantId: zod_1.z.number().optional(),
});
//# sourceMappingURL=DocumentTypeReadSchema.js.map