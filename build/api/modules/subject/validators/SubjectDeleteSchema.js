"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectDeleteSchema = void 0;
const zod_1 = require("zod");
exports.SubjectDeleteSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "Subject ID is required",
        invalid_type_error: "Subject ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
});
//# sourceMappingURL=SubjectDeleteSchema.js.map