"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registry = exports.default = void 0;

var _utils = require("./utils");

var _Resource = _interopRequireDefault(require("./Resource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var identity = x => x;

class Registry {
  constructor(options) {
    this.options = options;
    this.resources = {};
    this.keyTransformFunc = this.options && this.options.keyTransform === "kebab" ? _utils.kebabCaseDeep : identity;
    this.keyParseFunc = this.options && this.options.keyTransform === "kebab" ? _utils.camelCaseDeep : identity;
  }

  define(type, spec) {
    var {
      attributes,
      relationships
    } = spec;
    var resource = new _Resource.default(this, type, attributes, relationships);
    this.resources[type] = resource;
    return resource;
  }

  find(type) {
    return this.resources[type];
  }

  parse(document) {
    if (Array.isArray(document.data)) {
      return document.data.map(this.parseResource, this);
    }

    return this.parseResource(document.data);
  }

  parseResource(data) {
    var resource = this.find(data.type);

    if (!resource) {
      throw new Error("Cannot find resource ".concat(data.type));
    }

    return resource.parse(data);
  }

}

exports.default = Registry;
var registry = new Registry();
exports.registry = registry;