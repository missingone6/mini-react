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
export function updateNode(node, nextVal) {
  Object.keys(nextVal).forEach(key => {
    if (key === 'children') {
      if (isStringOrNumber(nextVal[key])) {
        node.textContent = nextVal[key]
      }
    } else {
      node[key] = nextVal[key]
    }
  })
}