"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInUserRecordSchema = void 0;
const zod_1 = require("zod");
exports.signInUserRecordSchema = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Argument password is missing",
    }),
    email: zod_1.z
        .string({
        required_error: "Argument email is missing",
    })
        .email("Not a valid email"),
    userType: zod_1.z.string({
        required_error: "Argument userType is missing",
    }),
});
//# sourceMappingURL=SignInUserRecordSchema.js.map