"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardianDeleteSchema = void 0;
const zod_1 = require("zod");
exports.guardianDeleteSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "Guardian ID is required",
        invalid_type_error: "Guardian ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
});
//# sourceMappingURL=GuardianDeleteSchema.js.map