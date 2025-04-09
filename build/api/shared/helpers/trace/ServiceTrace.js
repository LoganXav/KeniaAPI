"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceTrace = void 0;
const ObjectPropertyUtil_1 = require("../../../../utils/ObjectPropertyUtil");
const StringUtil_1 = require("../../../../utils/StringUtil");
class ServiceTrace {
    constructor(session, startDate, origin, transactionId) {
        this.session = session;
        this.origin = origin;
        this.transactionId = transactionId;
        this.success = false;
        this.startDate = startDate.toISOString();
        this.metadata = {};
    }
    toJSON() {
        return { ...this };
    }
    setContext(value) {
        if (this.context) {
            this.context = this.context.concat(StringUtil_1.StringUtil.DOT).concat(value);
        }
        else {
            this.context = value;
        }
    }
    setClient(client) {
        this.client = client;
        return this;
    }
    setRequest(value) {
        if (this.payload)
            return this;
        this.payload = value;
        return this;
    }
    setArgs(args, propsToRemove) {
        if (!args)
            return;
        this.payload.body = { ...args };
        ObjectPropertyUtil_1.ObjectPropertyUtil.remove(this.payload.body, propsToRemove);
    }
    setSuccessful() {
        this.success = true;
    }
    addMetadata(key, value) {
        this.metadata[key] = value;
    }
    finish(date) {
        this.endDate = date.toISOString();
    }
}
exports.ServiceTrace = ServiceTrace;
//# sourceMappingURL=ServiceTrace.js.map