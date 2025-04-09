"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestPasswordResetSchema = void 0;
const zod_1 = require("zod");
exports.requestPasswordResetSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Argument email is missing",
    })
        .email("Not a valid email"),
});
//# sourceMappingURL=RequestPasswordResetSchema.js.map