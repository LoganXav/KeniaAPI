"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpUserRecordSchema = void 0;
const zod_1 = require("zod");
exports.signUpUserRecordSchema = zod_1.z.object({
    firstName: zod_1.z.string({
        required_error: "Argument first name is missing",
    }),
    lastName: zod_1.z.string({
        required_error: "Argument last name is missing",
    }),
    password: zod_1.z.string({
        required_error: "Argument password is missing",
    }),
    phoneNumber: zod_1.z.string({
        required_error: "Argument phone number is missing",
    }),
    email: zod_1.z
        .string({
        required_error: "Argument email is missing",
    })
        .email("Not a valid email"),
});
//# sourceMappingURL=SignUpUserRecordSchema.js.map