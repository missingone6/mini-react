import { createFiber } from "./ReactFiber";
import { isArray, isSameType, isStringOrNumber, Placement, Update } from "./utils";


export function reconcileChildren(returnFiber, children) {

  let lastPlacedIndex = 0;// 上次插入的位置
  let shouldTrackSideEffects = !!returnFiber.alternate; //是否初次渲染
  let nextOldFiber; //暂存oldFiber
  if (isStringOrNumber(children)) {
    return;
  }
  // todo 单子节点和多子节点分开处理
  const newChildren = isArray(children) ? children : [children]
  let previousFiber = null;
  let oldFiber = returnFiber.alternate?.child;
  /**
   * 1.如果有oldFiber，就将oldFiber和newChildren挨个对比，符合条件就复用，不符合就退出循环。此时，有4种可能结果（2，3，4，5）
   * 2.oldFiber没遍历完，newChildren遍历完。
   *  意味着本次更新比之前的节点数量少，有节点被删除了。所以需要遍历剩下的oldFiber，依次放入父fiber节点的deletions数组标记为删除。
   * 3.newChildren没遍历完，oldFiber遍历完。（初次渲染也属于这种情况，因为没有oldFiber）
      已有的DOM节点都复用了，这时还有新加入的节点，意味着本次更新有新节点插入，
      我们只需要遍历剩下的newChildren为生成的workInProgress fiber依次标记Placement。
   * 4.都没遍历完，比较麻烦。
   * 
   * 5.都遍历完了，皆大欢喜。直接结束！
   * 
   * */

  // 1.如果有oldFiber，就将oldFiber和newChildren挨个对比，符合条件就复用，不符合就退出循环。
  let i = 0;
  for (; oldFiber && i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild === null || newChild === undefined) {
      continue;
    }

    // todo 用!==还是> ???
    if (oldFiber.index !== i) {
      nextOldFiber = oldFiber;
      oldFiber = null;// 会跳出循环
    } else {
      nextOldFiber = oldFiber.sibling;
    }
    if (!isSameType(oldFiber, newChild)) {
      if (oldFiber === null) {
        oldFiber = nextOldFiber;
      }
      break;
    }

    const newFiber = createFiber(newChild, returnFiber);
    Object.assign(newFiber, {
      flags: Update,
      stateNode: oldFiber.stateNode,
      alternate: oldFiber
    })
    console.log('复用成功1', oldFiber, newFiber)
    lastPlacedIndex = placeIndex(newFiber, lastPlacedIndex, i, shouldTrackSideEffects)

    if (previousFiber === null) {
      returnFiber.child = newFiber;
    } else {
      previousFiber.sibling = newFiber;
    }
    previousFiber = newFiber;
    oldFiber = nextOldFiber;
  }

  // 2.newChildren遍历完。
  // 意味着本次更新比之前的节点数量少，有节点被删除了。所以需要遍历剩下的oldFiber，依次放入父fiber节点的deletions数组标记为删除。
  if (i === newChildren.length) {
    console.log(222)
    deleteRemainingChildren(returnFiber, oldFiber);
    return;
  }

  // 3.newChildren没遍历完，oldFiber遍历完。（初次渲染也属于这种情况，因为没有oldFiber）
  // 已有的DOM节点都复用了，这时还有新加入的节点，意味着本次更新有新节点插入，
  // 我们只需要遍历剩下的newChildren为生成的workInProgress fiber依次标记Placement。
  if (!oldFiber) {
    for (; i < newChildren.length; i++) {
      const newChild = newChildren[i];
      // 比如写jsx时写成这样 {num?<span>111</span>:null} ,null不渲染
      if (newChild === null || newChild === undefined) {
        continue;
      }
      const newFiber = createFiber(newChild, returnFiber);
      lastPlacedIndex = placeIndex(newFiber, lastPlacedIndex, i, shouldTrackSideEffects);
      if (previousFiber === null) {
        returnFiber.child = newFiber;
      } else {
        previousFiber.sibling = newFiber;
      }
      previousFiber = newFiber;
    }
  }
  // 4. oldFiber和newChildren都没遍历完
  const existingChildren = mapRemainingChildren(oldFiber);
  for (; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild === null || newChild === undefined) {
      continue;
    }
    const shouldAlternate = existingChildren.has(newChild.key || newChild.index);
    const newFiber = createFiber(newChild, returnFiber);
    if (shouldAlternate) {
      const oldFiber = existingChildren.get(newChild.key || newChild.index);
      Object.assign(newFiber, {
        flags: Update,
        stateNode: oldFiber.stateNode,
        alternate: oldFiber
      })
      lastPlacedIndex = placeIndex(newFiber, lastPlacedIndex, i, shouldTrackSideEffects)
      console.log('复用成功4', oldFiber, newFiber)
      existingChildren.delete(newChild.key || newChild.index);
    }

    if (previousFiber === null) {
      returnFiber.child = newFiber;
    } else {
      previousFiber.sibling = newFiber;
    }
    previousFiber = newFiber;
  }
  // 4.删除existingChildren剩下的
  //更新阶段才可能有existingChildren
  if (shouldTrackSideEffects) {
    for (const [, fiber] of existingChildren) {
      console.log('删除existingChildren剩下的')
      deleteChild(returnFiber, fiber);
    }
  }
}

function deleteChild(returnFiber, childToDelete) {
  let deletions = returnFiber.deletions;
  if (deletions === null) {
    returnFiber.deletions = [childToDelete];
    // returnFiber.flags |= ChildDeletion;
  } else {
    deletions.push(childToDelete)
  }
}

function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild;
  while (childToDelete) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
}

function mapRemainingChildren(oldFiber) {
  const existingChildren = new Map();
  let prev = oldFiber;

  while (prev) {
    existingChildren.set(prev.key || prev.index, prev);
    prev = prev.sibling;
  }
  return existingChildren;
}

function placeIndex(newFiber, lastPlacedIndex, index, shouldTrackSideEffects) {
  newFiber.index = index;
  // 父节点 是否初次渲染
  if (!shouldTrackSideEffects) {
    return lastPlacedIndex
  } else {
    // 子节点 是否初次渲染
    const current = newFiber.alternate;
    if (current) {
      const oldIndex = current.index;
      if (oldIndex >= lastPlacedIndex) {
        return oldIndex;
      } else {
        newFiber.flags |= Placement;
        return lastPlacedIndex;
      }
    } else {
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    }
  }
}