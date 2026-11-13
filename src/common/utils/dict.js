import { getStore } from './store';

let dictList = [];

export function setDictList(list) {
  dictList = Array.isArray(list) ? list : [];
}

function getDictList() {
  if (dictList.length > 0) {
    return dictList;
  }
  const store = getStore();
  if (!store) {
    return [];
  }
  return (store.getState().dict || {}).dictList || [];
}

export function name(type, value) {
  const dict = getDictList().find(item => item.type == type && item.dictValue == value);
  return dict ? dict.name : '';
}

export function value(type, name) {
  const dict = getDictList().find(item => item.type == type && item.name == name);
  return dict ? dict.dictValue : '';
}

export function listByType(type) {
  return getDictList().filter(item => item.type == type);
}

export default {
  name: name,
  value: value,
  listByType: listByType,
};
