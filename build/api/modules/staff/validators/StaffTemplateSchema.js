"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffTemplateParamsSchema = void 0;
const zod_1 = require("zod");
exports.staffTemplateParamsSchema = zod_1.z.object({
    codeValue: zod_1.z
        .string({
        required_error: "Code Value is required",
    })
        .optional(),
});
//# sourceMappingURL=StaffTemplateSchema.js.map