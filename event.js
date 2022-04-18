"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
class Event {
    constructor(_id, startTime, endTime, eventType) {
        this._id = _id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.eventType = eventType;
    }
}
exports.default = Event;
var EventType;
(function (EventType) {
    EventType["ARRIVED"] = "ARRIVED";
    EventType["INSPECT"] = "INSPECT";
})(EventType = exports.EventType || (exports.EventType = {}));
