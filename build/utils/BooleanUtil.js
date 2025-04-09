"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanUtil = void 0;
class BooleanUtil {
    static areEqual(reference, value) {
        if (!reference || !value)
            return false;
        if (typeof reference !== typeof value)
            return false;
        if (Array.isArray(reference)) {
            throw new Error("Array comparison not implemented");
        }
        const type = typeof reference;
        if (type === "function")
            return reference.toString() === value.toString();
        if (type !== "object")
            return reference === value;
        const referenceKeys = Object.keys(reference);
        const valueKeys = Object.keys(value);
        if (referenceKeys.length !== valueKeys.length)
            return false;
        return JSON.stringify(reference) === JSON.stringify(value);
    }
    static areDifferent(reference, value) {
        return !this.areEqual(reference, value);
    }
    static isBoolean(value) {
        return Boolean(value);
    }
}
exports.BooleanUtil = BooleanUtil;
BooleanUtil.NOT_VERIFIED = false;
//# sourceMappingURL=BooleanUtil.js.map