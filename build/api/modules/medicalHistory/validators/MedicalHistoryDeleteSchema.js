"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalHistoryDeleteSchema = void 0;
const zod_1 = require("zod");
exports.medicalHistoryDeleteSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "Medical History ID is required",
        invalid_type_error: "Medical History ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
});
//# sourceMappingURL=MedicalHistoryDeleteSchema.js.map