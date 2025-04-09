"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timetableReadOneRequestSchema = exports.timetableReadRequestSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.timetableReadRequestSchema = zod_1.z.object({
    classDivisionId: zod_1.z.union([zod_1.z.number({ invalid_type_error: "Class division ID must be a number" }), zod_1.z.string({ invalid_type_error: "Class division ID must be a string" })]),
    termId: zod_1.z.union([zod_1.z.number({ invalid_type_error: "Term ID must be a number" }), zod_1.z.string({ invalid_type_error: "Term ID must be a string" })]),
});
exports.timetableReadOneRequestSchema = zod_1.z.object({
    classDivisionId: zod_1.z.union([zod_1.z.number({ invalid_type_error: "Class division ID must be a number", required_error: "Class division ID is required" }), zod_1.z.string({ invalid_type_error: "Class division ID must be a string", required_error: "Class division ID is required" })]),
    day: zod_1.z.nativeEnum(client_1.Weekday, { invalid_type_error: "Day must be a valid weekday", required_error: "Day is required" }),
    termId: zod_1.z.union([zod_1.z.number({ invalid_type_error: "Term ID must be a number", required_error: "Term ID is required" }), zod_1.z.string({ invalid_type_error: "Term ID must be a string", required_error: "Term ID is required" })]),
});
//# sourceMappingURL=TimetableReadSchema.js.map