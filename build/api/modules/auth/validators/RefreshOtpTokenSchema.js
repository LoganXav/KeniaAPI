"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshOtpTokenSchema = void 0;
const zod_1 = require("zod");
exports.refreshOtpTokenSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Argument email is missing",
    })
        .email("Not a valid email"),
});
//# sourceMappingURL=RefreshOtpTokenSchema.js.map