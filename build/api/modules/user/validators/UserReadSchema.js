"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userReadSchema = void 0;
const zod_1 = require("zod");
exports.userReadSchema = zod_1.z.object({
    tenantId: zod_1.z.number({ required_error: "Tenant ID is required", invalid_type_error: "Tenant ID must be an integer" }),
    userId: zod_1.z.number({ required_error: "User ID is required", invalid_type_error: "User ID must be an integer" }),
});
//# sourceMappingURL=UserReadSchema.js.map