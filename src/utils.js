export const NoFlags = 0b00000000000000000000;
export const Placement = 0b00000000000000000010;
export const Update = 0b00000000000000000100;
export const Deletion = 0b00000000000000001000;

export function isStr(s) {
  return typeof s === 'string';
}

export function isStringOrNumber(s) {
  return typeof s === 'string' || typeof s === 'number';
}

export function isFn(fn) {
  return typeof fn === 'function';
}

export function isArray(arr) {
  return Array.isArray(arr);
}
export function isUndefined(u) {
  return u === undefined;
}
export function isSymbol(s) {
  return typeof s === 'symbol';
}
export function isSameType(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}
function isFunction(f) {
  return typeof f === 'function';
}
export function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal).forEach(key => {
    if (key === 'children') {
      if (isStringOrNumber(prevVal[key])) {
        node.textContent = "";
      }
    } else if (key.slice(0, 2) === 'on' && isFunction(nextVal[key])) {
      // todo 1.更规范的处理事件  2.支持合成事件
      const type = key.slice(2).toLocaleLowerCase();
      node.removeEventListener(type, prevVal[key]);
    }
    else {
      if (!(key in nextVal)) {
        node[key] = "";
      }
    }
  })
  Object.keys(nextVal).forEach(key => {
    if (key === 'children') {
      if (isStringOrNumber(nextVal[key])) {
        node.textContent = nextVal[key]
      }
    } else if (key.slice(0, 2) === 'on' && isFunction(nextVal[key])) {
      // todo 1.更规范的处理事件  2.支持合成事件
      const type = key.slice(2).toLocaleLowerCase();
      node.addEventListener(type, nextVal[key]);
    }
    else {
      node[key] = nextVal[key]
    }
  })
}