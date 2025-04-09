"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentGroupDeleteSchema = void 0;
const zod_1 = require("zod");
exports.studentGroupDeleteSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "Student Group ID is required",
        invalid_type_error: "Student Group ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
});
//# sourceMappingURL=StudentGroupDeleteSchema.js.map