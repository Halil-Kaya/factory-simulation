export default class Event{
    _id : number;
    startTime : number;
    endTime : number;
    eventType : EventType;
    constructor(_id : number,startTime : number,endTime : number,eventType : EventType){
        this._id = _id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.eventType = eventType
    }
}

export enum EventType {
    ARRIVED = 'ARRIVED',
    INSPECT = 'INSPECT'
}