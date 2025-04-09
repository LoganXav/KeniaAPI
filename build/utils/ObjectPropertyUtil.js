"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPropertyUtil = void 0;
const TypeParser_1 = require("./TypeParser");
class ObjectPropertyUtil {
    static assign(origin, target, propertyName) {
        if (!Reflect.has(TypeParser_1.TypeParser.cast(origin), propertyName))
            return;
        Reflect.set(TypeParser_1.TypeParser.cast(target), propertyName, Reflect.get(TypeParser_1.TypeParser.cast(origin), propertyName));
    }
    static remove(target, propsToRemove) {
        if (!propsToRemove?.length || !target)
            return;
        propsToRemove.forEach((propertyName) => {
            if (Reflect.has(TypeParser_1.TypeParser.cast(target), propertyName)) {
                Reflect.deleteProperty(target, propertyName);
            }
        });
    }
}
exports.ObjectPropertyUtil = ObjectPropertyUtil;
//# sourceMappingURL=ObjectPropertyUtil.js.map