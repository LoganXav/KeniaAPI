"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakPeriodCreateSchema = void 0;
const zod_1 = require("zod");
exports.breakPeriodCreateSchema = zod_1.z.object({
    id: zod_1.z.number({ required_error: "ID is required", invalid_type_error: "ID must be a number" }).optional(),
    name: zod_1.z.string({ required_error: "Break period name is required", invalid_type_error: "Break period name must be a string" }).optional(),
    startDate: zod_1.z.string({ required_error: "Break period start date is required", invalid_type_error: "Break period start date must be a string" }).optional(),
    endDate: zod_1.z.string({ required_error: "Break period end date is required", invalid_type_error: "Break period end date must be a string" }).optional(),
    termId: zod_1.z.number({ required_error: "Term ID is required", invalid_type_error: "Term ID must be a number" }).optional(),
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }).optional(),
});
//# sourceMappingURL=BreakPeriodCreateSchema.js.map