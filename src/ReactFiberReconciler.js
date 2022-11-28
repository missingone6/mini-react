import { renderWithHooks } from "./hooks";
import { reconcileChildren } from "./ReactChildFiber";
import { updateNode } from "./utils";

export function updateHostComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = document.createElement(workInProgress.type);
  }
  updateNode(workInProgress.stateNode, {}, workInProgress.props)
  reconcileChildren(workInProgress, workInProgress.props.children);
}
export function updateFunctionComponent(workInProgress) {
  renderWithHooks(workInProgress);
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