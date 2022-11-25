import { createFiber } from "./ReactFiber";
import { schedulerUpdateOnFiber } from "./ReactFiberWorkLoop";

function ReactDOMRoot(root) {
  this._internalRoot = root;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  updateContainer(children, root)
}

function createRoot(container) {
  const root = {
    containerInfo: container,
  }
  return new ReactDOMRoot(root);
}
function updateContainer(element, container) {
  const { containerInfo } = container;
  const fiber = createFiber(element, {
    typeof: containerInfo.nodeName.toLocaleLowerCase(),
    stateNode: containerInfo,
  })
  // 组件初次渲染
  schedulerUpdateOnFiber(fiber)
}

export default { createRoot };