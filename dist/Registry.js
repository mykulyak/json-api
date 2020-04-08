"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registry = exports.default = void 0;

var _utils = require("./utils");

var _Resource = _interopRequireDefault(require("./Resource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Registry {
  constructor(options) {
    this.options = options;
    this.resources = {};
    this.keyTransformFunc = this.options && this.options.keyTransform === "kebab" ? _utils.kebabCaseDeep : _utils.identity;
    this.keyParseFunc = this.options && this.options.keyTransform === "kebab" ? _utils.camelCaseDeep : _utils.identity;
  }

  define(type, spec) {
    var {
      id,
      attributes,
      relationships
    } = spec;
    var resource = new _Resource.default(this, type, id, attributes, relationships);
    this.resources[type] = resource;
    return resource;
  }

  find(type) {
    return this.resources[type];
  }

  format(type, data) {
    var resource = this.find(type);

    if (!resource) {
      throw new Error("Cannot find resource ".concat(type));
    }

    return resource.document(data);
  }

  parse(document, options) {
    var parseResource = (data, includesMap) => {
      var resource = this.find(data.type);

      if (!resource) {
        throw new Error("Cannot find resource ".concat(data.type));
      }

      return resource.parse(data, includesMap, options);
    };

    var includesMap = Array.isArray(document.included) ? document.included.reduce((accum, res) => {
      var resource = parseResource(res); // eslint-disable-next-line no-param-reassign

      accum["".concat(res.type, ":").concat(resource.id)] = resource;
      return accum;
    }, {}) : null;

    if (Array.isArray(document.data)) {
      return document.data.map(elem => parseResource(elem, includesMap));
    }

    return parseResource(document.data, includesMap);
  }

}

exports.default = Registry;
var registry = new Registry();
exports.registry = registry;