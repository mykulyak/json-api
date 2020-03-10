"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registry = exports.Registry = exports.Resource = void 0;

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var identity = function identity(x) {
  return x;
};

var defaultAttributeSpec = {
  getter: function getter(data, key) {
    return data[key];
  },
  formatter: function formatter(value) {
    return value;
  }
};

var Resource =
/*#__PURE__*/
function () {
  function Resource(registry, type, attributes, relationships) {
    _classCallCheck(this, Resource);

    this.registry = registry;
    this.type = type;
    this.attributes = this.normalizeAttributes(attributes);
    this.relationships = this.normalizeRelationships(relationships, registry);
  }

  _createClass(Resource, [{
    key: "normalizeAttributes",
    value: function normalizeAttributes(specs) {
      if (Array.isArray(specs)) {
        return specs.map(function (spec) {
          if (typeof spec === "string") {
            return [spec, defaultAttributeSpec];
          }

          return spec;
        });
      } else if (specs != null) {
        return Object.entries(specs).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          return [key, _objectSpread({}, defaultAttributeSpec, {}, value)];
        });
      }

      return [];
    }
  }, {
    key: "normalizeRelationships",
    value: function normalizeRelationships(relationshipSpecs, registry) {
      if (relationshipSpecs != null) {
        return Object.entries(relationshipSpecs).map(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              value = _ref4[1];

          var getter = function getter(data, key) {
            var relatedResourceClass;

            if (typeof value === "string") {
              relatedResourceClass = registry.find(value);
            } else if (value instanceof Resource) {
              relatedResourceClass = value;
            } else {
              relatedResourceClass = registry.find(value.type);
            }

            if (!relatedResourceClass) {
              throw new Error("Cannot find ".concat(value, " resource"));
            }

            var formatRelationship = value._embed ? function (r) {
              return relatedResourceClass.resource(r);
            } : function (r) {
              return relatedResourceClass.link(r);
            };
            var raw = data[key];

            if (Array.isArray(raw)) {
              return {
                data: raw.map(formatRelationship)
              };
            } else if (raw != null) {
              return {
                data: formatRelationship(raw)
              };
            }

            return {
              data: null
            };
          };

          return [key, getter];
        });
      }

      return null;
    }
  }, {
    key: "id",
    value: function id(value) {
      return {
        type: this.type,
        id: value != null ? String(value) : null
      };
    }
  }, {
    key: "link",
    value: function link(value) {
      return {
        type: this.type,
        id: value != null ? String(value) : null
      };
    }
  }, {
    key: "resource",
    value: function resource(data) {
      var _this = this;

      var result = {
        type: this.type
      };

      if (data.id === null) {
        result.id = null;
      } else if (data.id !== undefined) {
        result.id = String(data.id);
      }

      result.attributes = this.registry._keyTransformFunc(this.attributes.reduce(function (accum, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            key = _ref6[0],
            desc = _ref6[1];

        var value = desc.formatter(desc.getter(data, key));

        if (value !== undefined) {
          accum[key] = value;
        }

        return accum;
      }, {}));

      if (this.relationships != null) {
        result.relationships = this.registry._keyTransformFunc(this.relationships.reduce(function (accum, _ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              key = _ref8[0],
              desc = _ref8[1];

          var value = desc(data, key, _this.registry);

          if (value !== undefined) {
            var resultKey = _this.registry._keyTransformFunc(key);

            accum[resultKey] = value;
          }

          return accum;
        }, {}));
      }

      return result;
    }
  }, {
    key: "document",
    value: function document(data) {
      return {
        data: _objectSpread({}, this.resource(data))
      };
    }
  }]);

  return Resource;
}();

exports.Resource = Resource;

var Registry =
/*#__PURE__*/
function () {
  function Registry(options) {
    _classCallCheck(this, Registry);

    this._options = options;
    this._resources = {};
    this._keyTransformFunc = this._options && this._options.keyTransform === "kebab" ? _utils.kebabCaseDeep : identity;
  }

  _createClass(Registry, [{
    key: "define",
    value: function define(type, spec) {
      var attributes = spec.attributes,
          relationships = spec.relationships;
      var resource = new Resource(this, type, attributes, relationships);
      this._resources[type] = resource;
      return resource;
    }
  }, {
    key: "find",
    value: function find(type) {
      return this._resources[type];
    }
  }]);

  return Registry;
}();

exports.Registry = Registry;
var registry = new Registry();
exports.registry = registry;