"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolCalendarCreateSchema = void 0;
const zod_1 = require("zod");
const TermCreateSchema_1 = require("../../term/validators/TermCreateSchema");
exports.schoolCalendarCreateSchema = zod_1.z.object({
    userId: zod_1.z.number({ required_error: "User ID is required", invalid_type_error: "User ID must be a number" }).optional(),
    id: zod_1.z.number({ required_error: "ID is required", invalid_type_error: "ID must be a number" }).optional(),
    year: zod_1.z.number({ required_error: "Year is required", invalid_type_error: "Year must be a number" }),
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be a number" }),
    terms: zod_1.z.array(TermCreateSchema_1.termCreateSchema).optional(),
});
//# sourceMappingURL=SchoolCalendarCreateSchema.js.map