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
  let i;
  for (i = 0; i < newChildren.length; i++) {
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
  // 新节点（children数组）已经遍历完，但是老节点（oldFiber链表）还有剩余的情况
  if (i === newChildren.length) {
    deleteRemainingChildren(workInProgress, oldFiber)
  }

}

function deleteChild(returnFiber, childToDelete) {
  // fiber.flags |= Deletion; 改用fiber.deletions
  if (!returnFiber.deletions) {
    returnFiber.deletions = [childToDelete];
  } else {
    returnFiber.deletions.push(childToDelete)
  }
}

function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild;
  while (childToDelete) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
}
