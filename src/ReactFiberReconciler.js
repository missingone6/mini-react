import { createFiber } from "./ReactFiber";
import { isArray, isStringOrNumber, updateNode } from "./utils";

export function updateHostComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = document.createElement(workInProgress.type);
  }
  updateNode(workInProgress.stateNode, workInProgress.props)
  reconcileChildren(workInProgress, workInProgress.props.children);
}
export function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress;
  const children = type(props);
  reconcileChildren(workInProgress, children)
}
export function updateClassComponent(workInProgress) {
  const { type, props } = workInProgress;
  const instance = new type(props);
  const children = instance.render();
  reconcileChildren(workInProgress, children)
}
export function updateFragmentComponent(workInProgress) {
  reconcileChildren(workInProgress, workInProgress.props.children)
}
export function updateHostTextComponent(workInProgress) {
  workInProgress.stateNode = document.createTextNode(workInProgress.props.children);
}

function reconcileChildren(workInProgress, children) {
  if (isStringOrNumber(children)) {
    return;
  }
  // todo 单子节点和多子节点分开处理
  const newChildren = isArray(children) ? children : [children]
  let previousFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild === null || newChild === undefined) {
      continue;
    }
    const fiber = createFiber(newChild, workInProgress);
    if (previousFiber === null) {
      workInProgress.child = fiber;
    } else {
      previousFiber.sibling = fiber;
    }
    previousFiber = fiber;
  }
}