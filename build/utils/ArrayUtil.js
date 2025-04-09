"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayUtil {
    static first(list) {
        if (!list?.length) {
            return null;
        }
        return list[ArrayUtil.FIRST_INDEX];
    }
    static last(list) {
        if (!list?.length) {
            return null;
        }
        const lastIndex = list.length - 1;
        return list[lastIndex];
    }
    static getWithIndex(list, index) {
        if (!list?.length) {
            return null;
        }
        return list[index];
    }
    static allOrDefault(list) {
        if (!list?.length) {
            return [];
        }
        return list;
    }
    static any(list) {
        return !!list?.length;
    }
    static fromObject(object) {
        return Object.keys(object).map((key) => object[key]);
    }
}
ArrayUtil.NOT_FOUND_INDEX = -1;
ArrayUtil.FIRST_INDEX = 0;
ArrayUtil.INDEX_ONE = 1;
exports.default = ArrayUtil;
//# sourceMappingURL=ArrayUtil.js.map