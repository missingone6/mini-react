import { ClassComponent, Fragment, FunctionComponent, HostComponent, HostText } from "./ReactWorkTags";
import { isFn, isStr, isSymbol, isUndefined, Placement } from "./utils";

export function createFiber(vNode, returnFiber) {
  const fiber = {
    type: vNode.type,
    key: vNode.key,
    props: vNode.props,
    stateNode: null,

    // 第一个子fiber
    child: null,
    sibling: null,
    return: returnFiber,
    flags: Placement,

    // 记录节点在当前层级下的位置
    index: null,

    // 用来判断是否是初次渲染
    alternate: null,
    // 存放hook
    memorizedState: null,
    // 存放要删除的子节点
    deletions: null,
  }
  // console.log(vNode, vNode.type)
  const { type } = vNode;
  if (isStr(type)) {
    fiber.tag = HostComponent;
  } else if (isFn(type)) {
    // 判断是class还是function 
    // https://overreacted.io/how-does-react-tell-a-class-from-a-function/
    fiber.tag = type.prototype.isReactComponent ? ClassComponent : FunctionComponent;
  } else if (isUndefined(type)) {
    fiber.tag = HostText;
    fiber.props = {
      children: vNode
    }
  } else if (isSymbol(type)) {
    fiber.tag = Fragment;
  }
  return fiber;
}
