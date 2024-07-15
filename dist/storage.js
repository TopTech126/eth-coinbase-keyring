"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MemoryStorage_scope;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStorage = void 0;
const store = new Map();
class MemoryStorage {
    constructor(scope) {
        _MemoryStorage_scope.set(this, void 0);
        __classPrivateFieldSet(this, _MemoryStorage_scope, scope, "f");
    }
    setItem(key, value) {
        store.set(this.scopedKey(key), value);
    }
    getItem(key) {
        return store.get(this.scopedKey(key));
    }
    removeItem(key) {
        store.delete(this.scopedKey(key));
    }
    clear() {
        const prefix = this.scopedKey('');
        const keysToRemove = [];
        store.forEach((_, key) => {
            if (key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        });
        keysToRemove.forEach((key) => {
            store.delete(key);
        });
    }
    scopedKey(key) {
        return `${__classPrivateFieldGet(this, _MemoryStorage_scope, "f")}:${key}`;
    }
}
exports.MemoryStorage = MemoryStorage;
_MemoryStorage_scope = new WeakMap();
//# sourceMappingURL=storage.js.map