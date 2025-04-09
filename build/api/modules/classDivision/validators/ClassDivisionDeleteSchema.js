"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassDivisionDeleteSchema = void 0;
const zod_1 = require("zod");
exports.ClassDivisionDeleteSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "Class division ID is required",
        invalid_type_error: "Class division ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
});
//# sourceMappingURL=ClassDivisionDeleteSchema.js.map