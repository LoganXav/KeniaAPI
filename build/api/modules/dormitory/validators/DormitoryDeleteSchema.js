"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dormitoryDeleteSchema = void 0;
const zod_1 = require("zod");
exports.dormitoryDeleteSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "Dormitory ID is required",
        invalid_type_error: "Dormitory ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
});
//# sourceMappingURL=DormitoryDeleteSchema.js.map