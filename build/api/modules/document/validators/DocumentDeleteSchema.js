"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentDeleteSchema = void 0;
const zod_1 = require("zod");
exports.DocumentDeleteSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "Document ID is required",
        invalid_type_error: "Document ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
});
//# sourceMappingURL=DocumentDeleteSchema.js.map