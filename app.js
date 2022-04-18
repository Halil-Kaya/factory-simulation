"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = __importStar(require("./event"));
const priority_queue_1 = __importDefault(require("./priority-queue"));
const futureEventsList = new priority_queue_1.default((a, b) => a.endTime < b.endTime);
const inspectorQueue = new priority_queue_1.default((a, b) => a.endTime < b.endTime);
let inspectingEvent = null;
let time = 0;
let _id = 0;
let totalFailParts = 0;
let isFinished = false;
let inspectorQueueLengths = [];
let futureEventListLengths = [];
const increaseId = () => {
    _id++;
};
const increaseTotalFail = () => {
    totalFailParts++;
};
const checkTotalFail = () => {
    if (totalFailParts >= 100) {
        isFinished = !isFinished;
    }
};
const setTime = (newTime) => {
    time = newTime;
};
const addFutureEventListLength = (x) => {
    futureEventListLengths.push(x);
};
const checkInspectorQueue = () => {
    return !inspectorQueue.isEmpty();
};
const initializationFunction = () => {
    setTime(0);
    console.log("*****************************************");
    console.log("time-> ", time);
    console.log("system initialized");
    const event = new event_1.default(_id, time, time + 5, event_1.EventType.ARRIVED);
    console.log("initial arrived event _id -> ", _id, " generated schedule for t = ", (time + 5));
    console.log("*****************************************");
    increaseId();
    futureEventsList.push(event);
};
const eventHandlingFunction = (eventType) => {
    if (eventType == event_1.EventType.INSPECT)
        InspectEvent();
    else if (eventType == event_1.EventType.ARRIVED)
        ArriveEvent();
};
const calculateInspectTime = () => {
    return Math.floor(Math.random() * 10) + 2;
};
const ArriveEvent = () => {
    console.log("******************************");
    console.log("time -> ", time);
    const lastEventId = futureEventsList.peek()._id;
    console.log("part ", lastEventId, " arrive for insepction");
    inspectorQueue.push(futureEventsList.poll());
    if (inspectingEvent == null) {
        console.log("insception starts");
        inspectorQueue.poll();
        console.log("inspector queue length ", inspectorQueue.size());
        inspectorQueueLengths.push(inspectorQueue.size());
        let inspectTime = calculateInspectTime();
        let endTime = time + inspectTime;
        let event = new event_1.default(lastEventId, time, endTime, event_1.EventType.INSPECT);
        console.log("part -> ", lastEventId, " schedule to leave system add t ", (endTime));
        inspectingEvent = event;
        futureEventsList.push(event);
    }
    const event = new event_1.default(_id, time, time + 5, event_1.EventType.ARRIVED);
    console.log("new arrival -> ", _id, " generated and schedule for t ", (time + 5));
    increaseId();
    futureEventsList.push(event);
    addFutureEventListLength(futureEventsList.size());
    console.log("******************************");
};
const printEvent = (event) => {
    console.log("-------------");
    console.log("_id of event -> ", event._id);
    console.log("start time of event-> ", event.startTime);
    console.log("end time of event -> ", event.endTime);
    console.log("event type -> ", event.eventType);
    console.log("-------------");
};
const InspectEvent = () => {
    console.log("******************************");
    console.log("time -> ", time);
    console.log("inspection completed");
    const lastEventId = futureEventsList.poll()._id;
    inspectingEvent = null;
    let i = Math.floor(Math.random() * 100);
    if (i > 10) {
        console.log("part ", lastEventId, "is success");
    }
    else {
        increaseTotalFail();
        console.log("part ", lastEventId, " is faulty total = ", totalFailParts);
        checkTotalFail();
    }
    if (checkInspectorQueue()) {
        let lastEventId = inspectorQueue.poll()._id;
        let inspectTime = calculateInspectTime();
        let endTime = time + inspectTime;
        let event = new event_1.default(lastEventId, time, endTime, event_1.EventType.INSPECT);
        console.log("inspector queue size -> ", inspectorQueue.size());
        inspectorQueueLengths.push(inspectorQueue.size());
        inspectingEvent = event;
        futureEventsList.push(event);
        addFutureEventListLength(futureEventsList.size());
        console.log("part -> ", lastEventId, " schedule to leave system add t ", (endTime));
    }
    else {
        console.log("inspector queue is empty");
    }
    console.log("******************************");
};
const timeAdvanceFunction = () => {
    futureEventsList.peek() != null;
    setTime(futureEventsList.peek().endTime);
    return futureEventsList.peek().eventType;
};
const generateReportFunction = () => {
    console.log("*-*-*-*-*-*-*-*Result*-*-*-*-*-*-*-*");
    console.log("Total simulation time -> " + time);
    console.log("Fel length when simulation ends -> " + futureEventsList.size());
    console.log("<*><*><*><*><*><*><*><*><*>");
    console.log("futureEventList -> ");
    for (let i = 0; i <= futureEventsList.size(); i++) {
        printEvent(futureEventsList.pop());
    }
    console.log("<*><*><*><*><*><*><*><*><*>");
    let totalFelLength = futureEventListLengths.reduce((partialSum, a) => partialSum + a, 0);
    let maxFelLength = Math.max(...futureEventListLengths);
    console.log("Fel maximum  length-> ", maxFelLength);
    console.log("Fel's average length-> ", (totalFelLength / futureEventListLengths.length));
    console.log("inspector queue's length in simulation ends-> ", inspectorQueue.size());
    console.log("<*><*><*><*><*><*><*><*><*>");
    console.log("Queue");
    for (let i = 0; i <= inspectorQueue.size(); i++) {
        printEvent(inspectorQueue.pop());
    }
    console.log("<*><*><*><*><*><*><*><*><*>");
    let totalQueueLengths = inspectorQueueLengths.reduce((partialSum, a) => partialSum + a, 0);
    let maxQueueLength = Math.max(...inspectorQueueLengths);
    console.log("inspector queue's avarage length: " + totalQueueLengths / inspectorQueueLengths.length);
    console.log("inspector queue's maximum length: " + maxQueueLength);
};
const startSimulation = () => {
    initializationFunction();
    while (!isFinished) {
        const eventType = timeAdvanceFunction();
        eventHandlingFunction(eventType);
    }
    generateReportFunction();
};
startSimulation();
