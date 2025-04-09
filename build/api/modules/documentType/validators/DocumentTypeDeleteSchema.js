"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypeDeleteSchema = void 0;
const zod_1 = require("zod");
exports.DocumentTypeDeleteSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "Document type ID is required",
        invalid_type_error: "Document type ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
});
//# sourceMappingURL=DocumentTypeDeleteSchema.js.map