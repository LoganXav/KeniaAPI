"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolCalendarReadSchema = void 0;
const zod_1 = require("zod");
exports.schoolCalendarReadSchema = zod_1.z.object({
    userId: zod_1.z.number().optional(),
    id: zod_1.z.number().optional(),
    year: zod_1.z.number().optional(),
    tenantId: zod_1.z.number().optional(),
});
//# sourceMappingURL=SchoolCalendarReadSchema.js.map