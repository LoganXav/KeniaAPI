"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _SchemasSecurityStore_store;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemasSecurityStore = void 0;
class SchemasSecurityStore {
    static add(key, schema) {
        __classPrivateFieldGet(this, _a, "f", _SchemasSecurityStore_store).securitySchemes[key] = schema;
    }
    static get() {
        return __classPrivateFieldGet(this, _a, "f", _SchemasSecurityStore_store).securitySchemes;
    }
    static dispose() {
        delete __classPrivateFieldGet(this, _a, "f", _SchemasSecurityStore_store).securitySchemes;
        __classPrivateFieldSet(this, _a, { securitySchemes: {} }, "f", _SchemasSecurityStore_store);
    }
}
exports.SchemasSecurityStore = SchemasSecurityStore;
_a = SchemasSecurityStore;
_SchemasSecurityStore_store = { value: { securitySchemes: {} } };
//# sourceMappingURL=SchemasSecurityStore.js.map