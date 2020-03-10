"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.camelCaseDeep = exports.camelCase = exports.kebabCaseDeep = exports.kebabCase = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var transformKeysDeep = function transformKeysDeep(obj, keyFn) {
  if (Array.isArray(obj)) {
    return obj.map(function (o) {
      return transformKeysDeep(o, keyFn);
    });
  }

  if (obj instanceof Object) {
    return Object.entries(obj).reduce(function (accum, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      var newKey = keyFn(key); // eslint-disable-next-line no-param-reassign

      accum[newKey] = transformKeysDeep(value, keyFn);
      return accum;
    }, {});
  }

  return obj;
};

var kebabCase = function kebabCase(str) {
  return str.split(/([A-Z][a-z0-9]+)/g).map(function (s) {
    return s.toLowerCase();
  }).filter(function (s) {
    return !!s.length;
  }).join("-");
};

exports.kebabCase = kebabCase;

var kebabCaseDeep = function kebabCaseDeep(obj) {
  return transformKeysDeep(obj, kebabCase);
};

exports.kebabCaseDeep = kebabCaseDeep;

var camelCase = function camelCase(str) {
  return str.split("-").map(function (s, index) {
    return index > 0 ? s.slice(0, 1).toUpperCase() + s.slice(1) : s;
  }).join("");
};

exports.camelCase = camelCase;

var camelCaseDeep = function camelCaseDeep(obj) {
  return transformKeysDeep(obj, camelCase);
};

exports.camelCaseDeep = camelCaseDeep;