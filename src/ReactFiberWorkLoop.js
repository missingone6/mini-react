import { updateHostComponent, updateClassComponent, updateFragmentComponent, updateFunctionComponent, updateHostTextComponent } from './ReactFiberReconciler';
import { ClassComponent, Fragment, FunctionComponent, HostComponent, HostText } from './ReactWorkTags'
import { schedulerCallback } from './scheduler';
import { Deletion, Placement, Update, updateNode } from './utils';
let workInProgress = null; //当前正在工作的树
let workInProgressRoot = null;

// 初次渲染和更新
export function schedulerUpdateOnFiber(fiber) {
  workInProgress = fiber;
  workInProgressRoot = fiber;
  schedulerCallback(workLoop);
}

function performUnitOfWork() {
  // 1.更新当前组件
  const { tag } = workInProgress;
  switch (tag) {
    case HostComponent:
      updateHostComponent(workInProgress);
      break;
    case FunctionComponent:
      updateFunctionComponent(workInProgress);
      break;
    case ClassComponent:
      updateClassComponent(workInProgress);
      break;
    case Fragment:
      updateFragmentComponent(workInProgress);
      break;
    case HostText:
      updateHostTextComponent(workInProgress);
      break;
  }
  // 2.深度优先遍历。返回下一个要更新的节点
  if (workInProgress.child) {
    workInProgress = workInProgress.child;
    return;
  }
  let next = workInProgress;
  while (next) {
    if (next.sibling) {
      workInProgress = next.sibling;
      return;
    }
    next = next.return;
  }
  workInProgress = null;
}

function workLoop() {
  while (workInProgress) {
    performUnitOfWork(workInProgress);
  }
  if (!workInProgress && workInProgressRoot) {
    commitRoot();
  }
}

function commitRoot() {
  commitWorker(workInProgressRoot);
  workInProgressRoot = null;
}

function commitWorker(workInProgress) {
  if (!workInProgress) {
    return;
  }
  // 提交自己，子节点，兄弟
  const { flags, stateNode } = workInProgress;
  // 找到父节点
  const parentStateNode = getParentNode(workInProgress.return);
  if (flags & Placement && stateNode) {
    const before = getHostSibling(workInProgress.sibling);
    // 多节点diff时，优先使用原生节点的insertBefore方法插入
    insertOrAppendPlacementNode(parentStateNode, stateNode, before);
  }
  if (flags & Update && stateNode) {
    updateNode(stateNode, workInProgress.alternate.props, workInProgress.props)
  }
  if (workInProgress.deletions && stateNode) {
    commitToDeletions(workInProgress.deletions, stateNode || fatherStateNode)
  }
  commitWorker(workInProgress.child);
  commitWorker(workInProgress.sibling);
}

// window.requestIdleCallback(workLoop);

function getParentNode(workInProgress) {
  let temp = workInProgress;
  while (temp) {
    if (temp.stateNode) {
      return temp.stateNode;
    }
    temp = temp.return;
  }
}
function getChildNode(workInProgress) {
  let temp = workInProgress;
  while (temp) {
    if (temp.stateNode) {
      return temp.stateNode;
    }
    temp = temp.child;
  }
}

function commitToDeletions(deletions, fatherStateNode) {
  deletions.forEach(item => {
    fatherStateNode.removeChild(getChildNode(item))
  });
}

function getHostSibling(sibling) {
  while (sibling) {
    if (sibling.stateNode && !(sibling.flags & Placement)) {
      return sibling.stateNode;
    }
    sibling = sibling.sibling;
  }
  return null;
}

function insertOrAppendPlacementNode(parentStateNode, stateNode, before) {
  if (before) {
    parentStateNode.insertBefore(stateNode, before)
  } else {
    parentStateNode.appendChild(stateNode);
  }
}

