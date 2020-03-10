const transformKeysDeep = (obj, keyFn) => {
  if (Array.isArray(obj)) {
    return obj.map(o => transformKeysDeep(o, keyFn));
  } else if (obj instanceof Object) {
    return Object.entries(obj).reduce((accum, [key, value]) => {
      const newKey = keyFn(key);
      accum[newKey] = transformKeysDeep(value, keyFn);
      return accum;
    }, {});
  }
  return obj;
};

export const kebabCase = str => {
  return str
    .split(/([A-Z][a-z0-9]+)/g)
    .map(s => s.toLowerCase())
    .filter(s => !!s.length)
    .join("-");
};

export const kebabCaseDeep = obj => transformKeysDeep(obj, kebabCase);
