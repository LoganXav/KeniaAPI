"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timetableDeleteSchema = void 0;
const zod_1 = require("zod");
exports.timetableDeleteSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "Timetable ID is required",
        invalid_type_error: "Timetable ID must be a number",
    }),
    tenantId: zod_1.z.number({
        required_error: "Tenant ID is required",
        invalid_type_error: "Tenant ID must be a number",
    }),
});
//# sourceMappingURL=TimetableDeleteSchema.js.map