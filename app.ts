import Event, { EventType } from "./event";
import PriorityQueue from "./priority-queue";

const futureEventsList = new PriorityQueue((a, b) => a.endTime < b.endTime);
const inspectorQueue = new PriorityQueue((a, b) => a.endTime < b.endTime);
let inspectingEvent: Event | null = null
let time: number = 0;
let _id: number = 0;
let totalFailParts: number = 0;
let isFinished: boolean = false;
let inspectorQueueLengths: number[] = []
let futureEventListLengths: number[] = []

const increaseId = (): void => {
  _id++;
}

const increaseTotalFail = (): void => {
  totalFailParts++
}

const checkTotalFail = (): void => {
  if (totalFailParts >= 100) {
    isFinished = !isFinished;
  }
}

const setTime = (newTime: number): void => {
  time = newTime
}

const addFutureEventListLength = (x: number): void => {
  futureEventListLengths.push(x)
}

const checkInspectorQueue = (): boolean => {
  return !inspectorQueue.isEmpty()
}

const initializationFunction = (): void => {
  setTime(0);
  console.log("*****************************************")
  console.log("time-> ", time)
  console.log("system initialized")
  const event = new Event(_id, time, time + 5, EventType.ARRIVED);
  console.log("initial arrived event _id -> ", _id, " generated schedule for t = ", (time + 5))
  console.log("*****************************************")
  increaseId()
  futureEventsList.push(event);
}

const eventHandlingFunction = (eventType: EventType): void => {
  if (eventType == EventType.INSPECT) InspectEvent()
  else if (eventType == EventType.ARRIVED) ArriveEvent()
}

const calculateInspectTime = () => {
  return Math.floor(Math.random() * 10) + 2;
}

const ArriveEvent = (): void => {
  console.log("******************************")
  console.log("time -> ", time)
  const lastEventId: number = futureEventsList.peek()._id;
  console.log("part ", lastEventId, " arrive for insepction")
  inspectorQueue.push(futureEventsList.poll());
  if (inspectingEvent == null) {
    console.log("insception starts")
    inspectorQueue.poll();
    console.log("inspector queue length ", inspectorQueue.size())
    inspectorQueueLengths.push(inspectorQueue.size())
    let inspectTime = calculateInspectTime()
    let endTime = time + inspectTime;
    let event: Event = new Event(lastEventId, time, endTime, EventType.INSPECT);
    console.log("part -> ", lastEventId, " schedule to leave system add t ", (endTime))
    inspectingEvent = event;
    futureEventsList.push(event);
  }
  const event: Event = new Event(_id, time, time + 5, EventType.ARRIVED);
  console.log("new arrival -> ", _id, " generated and schedule for t ", (time + 5))
  increaseId()
  futureEventsList.push(event);
  addFutureEventListLength(futureEventsList.size())
  console.log("******************************")
}

const printEvent = (event : Event) => {
  console.log("-------------")
  console.log("_id of event -> ",event._id)
  console.log("start time of event-> ",event.startTime)
  console.log("end time of event -> ",event.endTime)
  console.log("event type -> ",event.eventType)
  console.log("-------------")
}

const InspectEvent = (): void => {
  console.log("******************************")
  console.log("time -> ", time)
  console.log("inspection completed")
  const lastEventId = futureEventsList.poll()._id;
  inspectingEvent = null;
  let i = Math.floor(Math.random() * 100);
  if (i > 10) {
    console.log("part ", lastEventId, "is success")
  } else {
    increaseTotalFail()
    console.log("part ", lastEventId, " is faulty total = ", totalFailParts)
    checkTotalFail()
  }
  if (checkInspectorQueue()) {
    let lastEventId: number = inspectorQueue.poll()._id;
    let inspectTime: number = calculateInspectTime()
    let endTime: number = time + inspectTime;
    let event: Event = new Event(lastEventId, time, endTime, EventType.INSPECT);
    console.log("inspector queue size -> ", inspectorQueue.size())
    inspectorQueueLengths.push(inspectorQueue.size())
    inspectingEvent = event;
    futureEventsList.push(event);
    addFutureEventListLength(futureEventsList.size())
    console.log("part -> ", lastEventId, " schedule to leave system add t ", (endTime))
  } else {
    console.log("inspector queue is empty")
  }
  console.log("******************************")
}

const timeAdvanceFunction = (): EventType => {
  futureEventsList.peek() != null;
  setTime(futureEventsList.peek().endTime);
  return futureEventsList.peek().eventType;
}

const generateReportFunction = (): void => {
  console.log("*-*-*-*-*-*-*-*Result*-*-*-*-*-*-*-*")
  console.log("Total simulation time -> " + time);
  console.log("Fel length when simulation ends -> " + futureEventsList.size());
  console.log("<*><*><*><*><*><*><*><*><*>");
  console.log("futureEventList -> ");
  for (let i = 0; i <= futureEventsList.size(); i++) {
    printEvent(futureEventsList.pop())
  }
  console.log("<*><*><*><*><*><*><*><*><*>");
  let totalFelLength = futureEventListLengths.reduce((partialSum, a) => partialSum + a, 0);
  let maxFelLength = Math.max(...futureEventListLengths)
  console.log("Fel maximum  length-> ", maxFelLength);
  console.log("Fel's average length-> ", (totalFelLength / futureEventListLengths.length));
  console.log("inspector queue's length in simulation ends-> ", inspectorQueue.size());
  console.log("<*><*><*><*><*><*><*><*><*>");
  console.log("Queue");
  for (let i = 0; i <= inspectorQueue.size(); i++) {
    printEvent(inspectorQueue.pop())
  }
  console.log("<*><*><*><*><*><*><*><*><*>");
  let totalQueueLengths = inspectorQueueLengths.reduce((partialSum, a) => partialSum + a, 0);
  let maxQueueLength = Math.max(...inspectorQueueLengths)
  console.log("inspector queue's avarage length: " + totalQueueLengths / inspectorQueueLengths.length)
  console.log("inspector queue's maximum length: " + maxQueueLength);
}

const startSimulation = (): void => {
  initializationFunction();
  while (!isFinished) {
    const eventType: EventType = timeAdvanceFunction();
    eventHandlingFunction(eventType);
  }
  generateReportFunction();
}

startSimulation()