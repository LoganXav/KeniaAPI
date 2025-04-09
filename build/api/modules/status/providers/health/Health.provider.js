"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HealthProvider {
    async get(name, date) {
        // TODO -- Refactor to use express status monitor
        return Promise.resolve(`${name.toUpperCase()} api service is online at ${date}`);
    }
}
exports.default = HealthProvider;
//# sourceMappingURL=Health.provider.js.map