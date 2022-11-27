import { schedulerUpdateOnFiber } from "./ReactFiberWorkLoop";

let currentlyRenderingFiber = null;
let workInProgressHook = null;

function updateWorkInProgressHook() {
  let hook;
  const current = currentlyRenderingFiber.alternate
  // 不是初次渲染，也就是组件更新
  if (current) {
    // 复用老fiber节点的hook
    currentlyRenderingFiber.memorizedState = current.memorizedState;
    if (workInProgressHook) {
      workInProgressHook = hook = workInProgressHook.next
    } else {
      workInProgressHook = hook = currentlyRenderingFiber.memorizedState;
    }
  } else { // 初次渲染
    hook = {
      memorizedState: null,
      next: null,
    }
    if (workInProgressHook) {
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      workInProgressHook = currentlyRenderingFiber.memorizedState = hook;
    }
  }
  return hook;
}

// 在将当前函数对应的fiber节点赋值给currentlyRenderingFiber
export function renderWithHooks(fiber) {
  currentlyRenderingFiber = fiber;
  currentlyRenderingFiber.memorizedState = null;
  workInProgressHook = null;
}

export function useReducer(reducer, initialArg) {
  const hook = updateWorkInProgressHook();

  if (!currentlyRenderingFiber.alternate) {
    // 是组件初次渲染
    hook.memorizedState = initialArg;
  }
  const dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, hook, reducer)

  return [hook.memorizedState, dispatch]
}

function dispatchReducerAction(fiber, hook, reducer, action) {
  hook.memorizedState = reducer ? reducer(hook.memorizedState) : action;
  fiber.alternate = { ...fiber };
  // todo 防止更新其它组件,感觉这里这么会有问题
  fiber.sibling = null;
  schedulerUpdateOnFiber(fiber);
}


export function useState(initialArg) {
  return useReducer(null, initialArg)
}