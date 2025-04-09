"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const listeners_1 = require("../../../modules/auth/listeners");
const EventTypes_enum_1 = require("../enums/EventTypes.enum");
const Event = new events_1.EventEmitter();
Event.on(EventTypes_enum_1.eventTypes.user.signUp, listeners_1.UserListener.onUserSignUp);
Event.on(EventTypes_enum_1.eventTypes.user.signIn, listeners_1.UserListener.onUserSignIn);
exports.default = Event;
//# sourceMappingURL=index.js.map