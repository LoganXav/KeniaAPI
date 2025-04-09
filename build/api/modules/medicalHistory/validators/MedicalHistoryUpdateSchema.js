"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalHistoryUpdateSchema = void 0;
const zod_1 = require("zod");
exports.medicalHistoryUpdateSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    studentId: zod_1.z.number().optional(),
    tenantId: zod_1.z.number().optional(),
});
//# sourceMappingURL=MedicalHistoryUpdateSchema.js.map