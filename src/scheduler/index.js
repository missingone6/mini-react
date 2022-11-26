import { peek, pop, push } from "./minHeap";

const taskQueue = [];
// const timerQueue = [];
const channel = new MessageChannel();
const port = channel.port1;
let currentTask = null;
let taskIdCounter = 1;
export function schedulerCallback(callback) {

  const currentTime = getCurrentTime();
  const startTime = currentTime;
  // todo 区分优先级
  const timeout = -1;
  const expirationTime = startTime + timeout;
  const newTask = {
    id: taskIdCounter++,
    callback,
    startTime,
    sortIndex: -1,
    // priorityLevel,
    expirationTime,
  }
  push(taskQueue, newTask);

  requestHostCallback();//请求调度
}
function requestHostCallback() {
  port.postMessage(null);
}
channel.port2.onmessage = function () {
  workLoop();
}

function getCurrentTime() {
  return performance.now();
}

function workLoop() {
  currentTask = peek(taskQueue);
  while (currentTask) {
    let callback = currentTask.callback;
    currentTask.callback = null;
    callback();
    pop(taskQueue);
    currentTask = peek(taskQueue);
  }
}