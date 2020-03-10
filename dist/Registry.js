"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registry = exports["default"] = void 0;

var _utils = require("./utils");

var _Resource = _interopRequireDefault(require("./Resource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var identity = function identity(x) {
  return x;
};

var Registry =
/*#__PURE__*/
function () {
  function Registry(options) {
    _classCallCheck(this, Registry);

    this.options = options;
    this.resources = {};
    this.keyTransformFunc = this.options && this.options.keyTransform === "kebab" ? _utils.kebabCaseDeep : identity;
    this.keyParseFunc = this.options && this.options.keyTransform === "kebab" ? _utils.camelCaseDeep : identity;
  }

  _createClass(Registry, [{
    key: "define",
    value: function define(type, spec) {
      var attributes = spec.attributes,
          relationships = spec.relationships;
      var resource = new _Resource["default"](this, type, attributes, relationships);
      this.resources[type] = resource;
      return resource;
    }
  }, {
    key: "find",
    value: function find(type) {
      return this.resources[type];
    }
  }, {
    key: "parse",
    value: function parse(document) {
      if (Array.isArray(document.data)) {
        return document.data.map(this.parseResource, this);
      }

      return this.parseResource(document.data);
    }
  }, {
    key: "parseResource",
    value: function parseResource(data) {
      var resource = this.find(data.type);

      if (!resource) {
        throw new Error("Cannot find resource ".concat(data.type));
      }

      return resource.parse(data);
    }
  }]);

  return Registry;
}();

exports["default"] = Registry;
var registry = new Registry();
exports.registry = registry;