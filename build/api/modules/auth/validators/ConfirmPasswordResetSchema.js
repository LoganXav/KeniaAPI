"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPasswordResetSchema = void 0;
const zod_1 = require("zod");
exports.confirmPasswordResetSchema = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Argument password is missing",
    }),
});
//# sourceMappingURL=ConfirmPasswordResetSchema.js.map