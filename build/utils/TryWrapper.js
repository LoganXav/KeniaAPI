"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryWrapper = void 0;
const TypeParser_1 = require("./TypeParser");
class TryWrapper {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    static exec(action, params) {
        try {
            const value = action(...params);
            return { value, success: true, error: undefined };
        }
        catch (error) {
            return {
                value: undefined,
                success: false,
                error: TypeParser_1.TypeParser.cast(error),
            };
        }
    }
    static async asyncExec(promise) {
        try {
            const value = await promise;
            return { value, success: true, error: undefined };
        }
        catch (error) {
            return {
                value: undefined,
                success: false,
                error: TypeParser_1.TypeParser.cast(error),
            };
        }
    }
}
exports.TryWrapper = TryWrapper;
//# sourceMappingURL=TryWrapper.js.map