"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectUpdateSchema = void 0;
const zod_1 = require("zod");
exports.subjectUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().min(1).optional(),
    classId: zod_1.z.number().optional(),
    tenantId: zod_1.z.number().optional(),
    classDivisionIds: zod_1.z.array(zod_1.z.number().int("Class Division ID must be an integer")).optional(),
    staffIds: zod_1.z.array(zod_1.z.number().int("Staff ID must be an integer")).optional(),
});
//# sourceMappingURL=SubjectUpdateSchema.js.map