"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classDivisionCreateSchema = void 0;
const zod_1 = require("zod");
exports.classDivisionCreateSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }),
    classId: zod_1.z.number({ required_error: "Class ID is required" }),
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required" }),
    userId: zod_1.z.number({ required_error: "Auth User ID is required" }),
});
//# sourceMappingURL=ClassDivisionCreateSchema.js.map