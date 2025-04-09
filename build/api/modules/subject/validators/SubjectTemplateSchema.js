"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectTemplateSchema = void 0;
const zod_1 = require("zod");
exports.subjectTemplateSchema = zod_1.z.object({
    tenantId: zod_1.z.number().int("Tenant ID must be an integer"),
});
//# sourceMappingURL=SubjectTemplateSchema.js.map