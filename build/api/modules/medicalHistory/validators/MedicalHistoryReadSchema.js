"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalHistoryReadSchema = void 0;
const zod_1 = require("zod");
exports.medicalHistoryReadSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    ids: zod_1.z.array(zod_1.z.number()).optional(),
    name: zod_1.z.string().optional(),
    studentId: zod_1.z.number().optional(),
    tenantId: zod_1.z.number().optional(),
});
//# sourceMappingURL=MedicalHistoryReadSchema.js.map