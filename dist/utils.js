"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.camelCaseDeep = exports.camelCase = exports.kebabCaseDeep = exports.kebabCase = exports.identity = exports.jsonApiMediaType = void 0;
var jsonApiMediaType = "(application/vnd.api+json";
exports.jsonApiMediaType = jsonApiMediaType;

var identity = x => x;

exports.identity = identity;

var transformKeysDeep = (obj, keyFn) => {
  if (Array.isArray(obj)) {
    return obj.map(o => transformKeysDeep(o, keyFn));
  }

  if (obj instanceof Object) {
    return Object.entries(obj).reduce((accum, [key, value]) => {
      var newKey = keyFn(key); // eslint-disable-next-line no-param-reassign

      accum[newKey] = transformKeysDeep(value, keyFn);
      return accum;
    }, {});
  }

  return obj;
};

var kebabCase = str => {
  return str.split(/([A-Z][a-z0-9]+)/g).map(s => s.toLowerCase()).filter(s => !!s.length).join("-");
};

exports.kebabCase = kebabCase;

var kebabCaseDeep = obj => transformKeysDeep(obj, kebabCase);

exports.kebabCaseDeep = kebabCaseDeep;

var camelCase = str => {
  return str.split("-").map((s, index) => index > 0 ? s.slice(0, 1).toUpperCase() + s.slice(1) : s).join("");
};

exports.camelCase = camelCase;

var camelCaseDeep = obj => transformKeysDeep(obj, camelCase);

exports.camelCaseDeep = camelCaseDeep;