"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Normalize = void 0;
const path_1 = require("path");
const os_1 = require("os");
const BooleanUtil_1 = require("../utils/BooleanUtil");
class Normalize {
    static pathFromOS(path) {
        return BooleanUtil_1.BooleanUtil.areEqual((0, os_1.type)(), "Windows_NT") ? path.replace(/\\/g, "/") : path;
    }
    static absolutePath(dirName, path) {
        return (0, path_1.join)(dirName, path);
    }
}
exports.Normalize = Normalize;
//# sourceMappingURL=Normalize.js.map