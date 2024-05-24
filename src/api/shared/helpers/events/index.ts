import { EventEmitter } from "events"
import { UserListener } from "~/api/modules/auth/listeners"
import { eventTypes } from "../enums/EventTypes.enum"

const Event: EventEmitter = new EventEmitter()

Event.on(eventTypes.user.signUp, UserListener.onUserSignUp)

export default Event
