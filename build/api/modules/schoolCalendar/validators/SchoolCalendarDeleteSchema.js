"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolCalendarDeleteSchema = void 0;
const zod_1 = require("zod");
exports.schoolCalendarDeleteSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "School Calendar ID is required",
        invalid_type_error: "School Calendar ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
});
//# sourceMappingURL=SchoolCalendarDeleteSchema.js.map