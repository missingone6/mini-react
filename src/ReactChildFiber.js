import { createFiber } from "./ReactFiber";
import { Deletion, isArray, isSameType, isStringOrNumber, Update } from "./utils";

export function reconcileChildren(workInProgress, children) {
  if (isStringOrNumber(children)) {
    return;
  }
  // todo 单子节点和多子节点分开处理
  const newChildren = isArray(children) ? children : [children]
  let previousFiber = null;
  let oldFiber = workInProgress.alternate?.child;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild === null || newChild === undefined) {
      continue;
    }
    const fiber = createFiber(newChild, workInProgress);
    if (oldFiber) {
      if (isSameType(oldFiber, oldFiber)) {
        Object.assign(fiber, {
          flags: Update,
          stateNode: oldFiber.stateNode,
          alternate: oldFiber
        })
      } else {
        // 有oldFiber并且不能复用，要删除
        deleteChild(workInProgress, oldFiber)
      }
      oldFiber = oldFiber.sibling;
    }
    if (previousFiber === null) {
      workInProgress.child = fiber;
    } else {
      previousFiber.sibling = fiber;
    }
    previousFiber = fiber;
  }
}

function deleteChild(returnFiber, childToDelete) {
  fiber.flags |= Deletion;
  if (!returnFiber.deletions) {
    returnFiber.deletions = [childToDelete];
  } else {
    returnFiber.deletions.push(childToDelete)
  }
}
