"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.termCreateSchema = void 0;
const zod_1 = require("zod");
const BreakPeriodCreateSchema_1 = require("../../breakPeriod/validators/BreakPeriodCreateSchema");
exports.termCreateSchema = zod_1.z.object({
    id: zod_1.z.number({ required_error: "ID is required", invalid_type_error: "ID must be a number" }).optional(),
    name: zod_1.z.string({ required_error: "Term name is required", invalid_type_error: "Term name must be a string" }).optional(),
    startDate: zod_1.z.string({ required_error: "Term start date is required", invalid_type_error: "Term start date must be a string" }).optional(),
    endDate: zod_1.z.string({ required_error: "Term end date is required", invalid_type_error: "Term end date must be a string" }).optional(),
    calendarId: zod_1.z.number({ required_error: "Calendar ID is required", invalid_type_error: "Calendar ID must be a number" }).optional(),
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }).optional(),
    breakWeeks: zod_1.z.array(BreakPeriodCreateSchema_1.breakPeriodCreateSchema).optional(),
});
//# sourceMappingURL=TermCreateSchema.js.map