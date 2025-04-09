"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dormitoryUpdateSchema = void 0;
const zod_1 = require("zod");
exports.dormitoryUpdateSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1).optional(),
    tenantId: zod_1.z.number().optional(),
});
//# sourceMappingURL=DormitoryUpdateSchema.js.map