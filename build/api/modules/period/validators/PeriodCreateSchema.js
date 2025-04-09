"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.periodCreateSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.periodCreateSchema = zod_1.z
    .object({
    id: zod_1.z.number({ invalid_type_error: "ID must be a number" }).optional(),
    startTime: zod_1.z.string({
        required_error: "Start time is required",
        invalid_type_error: "Start time must be a string",
    }),
    endTime: zod_1.z.string({
        required_error: "End time is required",
        invalid_type_error: "End time must be a string",
    }),
    subjectId: zod_1.z.number({ invalid_type_error: "Subject ID must be a number" }).optional(),
    timetableId: zod_1.z.number({ invalid_type_error: "Timetable ID must be a number" }).optional(),
    isBreak: zod_1.z.boolean({ invalid_type_error: "Is break must be a boolean" }).default(false),
    breakType: zod_1.z
        .nativeEnum(client_1.BreakType, {
        invalid_type_error: "Break type must be a valid break type",
    })
        .optional(),
})
    .refine((data) => {
    // Ensure breakType is provided if isBreak is true
    return !data.isBreak || (data.isBreak && data.breakType !== undefined);
}, {
    message: "Break type is required when isBreak is true",
    path: ["breakType"], // This specifies where the error should appear
});
//# sourceMappingURL=PeriodCreateSchema.js.map