"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
exports.validateParams = validateParams;
const zod_1 = require("zod");
const HttpStatusCode_enum_1 = require("../../../shared/helpers/enums/HttpStatusCode.enum");
const SystemMessages_1 = require("../../../shared/helpers/messages/SystemMessages");
function validateData(schema) {
    return async (req, res, next) => {
        try {
            const validatedData = await schema.parseAsync(req.body);
            req.body = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: issue.message,
                }));
                res.status(HttpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST).json({ error: SystemMessages_1.VALIDATION_ERROR, details: errorMessages });
            }
            else {
                res.status(HttpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: SystemMessages_1.INTERNAL_SERVER_ERROR });
            }
        }
    };
}
function validateParams(schema) {
    return async (req, res, next) => {
        try {
            const validatedQueryParams = await schema.parseAsync(req.query);
            req.query = validatedQueryParams;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: issue.message,
                }));
                res.status(HttpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST).json({ error: SystemMessages_1.VALIDATION_ERROR, details: errorMessages });
            }
            else {
                res.status(HttpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({ error: SystemMessages_1.INTERNAL_SERVER_ERROR });
            }
        }
    };
}
//# sourceMappingURL=validateData.js.map