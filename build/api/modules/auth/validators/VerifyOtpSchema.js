"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpTokenSchema = void 0;
const zod_1 = require("zod");
exports.verifyOtpTokenSchema = zod_1.z.object({
    id: zod_1.z.number({
        required_error: "Argument id is missing",
    }),
    otpToken: zod_1.z
        .string({
        required_error: "Argument otpToken is missing",
    })
        .min(5, { message: "Invalid Token" })
        .max(5, { message: "Invalid Token" }),
});
//# sourceMappingURL=VerifyOtpSchema.js.map