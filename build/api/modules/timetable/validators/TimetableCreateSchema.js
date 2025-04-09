"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timetableCreateOrUpdateSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const PeriodCreateSchema_1 = require("../../period/validators/PeriodCreateSchema");
exports.timetableCreateOrUpdateSchema = zod_1.z.object({
    id: zod_1.z.number({ invalid_type_error: "ID must be a number" }).optional(),
    day: zod_1.z.nativeEnum(client_1.Weekday, {
        required_error: "Day is required",
        invalid_type_error: "Day must be a valid weekday",
    }),
    termId: zod_1.z.number({ invalid_type_error: "Term ID must be a number", required_error: "Term ID is required" }),
    classDivisionId: zod_1.z.number({
        required_error: "Class division ID is required",
        invalid_type_error: "Class division ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
    periods: zod_1.z.array(PeriodCreateSchema_1.periodCreateSchema),
});
//# sourceMappingURL=TimetableCreateSchema.js.map