"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultIdSpec = {
  attr: "id",

  format(value) {
    if (value === null) {
      return null;
    }

    if (value === undefined) {
      return undefined;
    }

    return String(value);
  },

  parse(resourceObj) {
    return resourceObj[this.attr] != null ? String(resourceObj[this.attr]) : null;
  }

};
var defaultAttributeSpec = {
  getter: (data, key) => data[key],
  formatter: value => value
};

class Resource {
  constructor(_registry, type, id, attributes, relationships) {
    _defineProperty(this, "normalizeAttributes", specs => {
      if (Array.isArray(specs)) {
        return specs.map(spec => {
          if (typeof spec === "string") {
            return [spec, defaultAttributeSpec];
          }

          return spec;
        });
      }

      if (specs != null) {
        return Object.entries(specs).map(([key, value]) => [key, _objectSpread({}, defaultAttributeSpec, {}, value)]);
      }

      return [];
    });

    _defineProperty(this, "normalizeRelationships", (relationshipSpecs, registry) => {
      if (relationshipSpecs != null) {
        return Object.entries(relationshipSpecs).map(([key, value]) => {
          // eslint-disable-next-line no-shadow
          var getter = (data, key) => {
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
            } // eslint-disable-next-line no-underscore-dangle


            var formatRelationship = value._embed ? r => relatedResourceClass.resource(r) : r => relatedResourceClass.link(r);
            var raw = data[key];

            if (Array.isArray(raw)) {
              return {
                data: raw.map(formatRelationship)
              };
            }

            if (raw != null) {
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
    });

    this.registry = _registry;
    this.type = type;
    this.idSpec = _objectSpread({}, defaultIdSpec, {}, id);
    this.attributes = this.normalizeAttributes(attributes);
    this.relationships = this.normalizeRelationships(relationships, _registry);
  }

  id(value) {
    return {
      type: this.type,
      id: this.idSpec.format(value)
    };
  }

  link(value) {
    return {
      type: this.type,
      id: this.idSpec.format(value)
    };
  }

  resource(data) {
    var result = {
      type: this.type
    };
    var id = this.idSpec.format(data[this.idSpec.attr]);

    if (id !== undefined) {
      result.id = id;
    }

    result.attributes = this.registry.keyTransformFunc(this.attributes.reduce((accum, [key, desc]) => {
      var value = desc.formatter(desc.getter(data, key));

      if (value !== undefined) {
        // eslint-disable-next-line no-param-reassign
        accum[key] = value;
      }

      return accum;
    }, {}));

    if (this.relationships != null) {
      result.relationships = this.registry.keyTransformFunc(this.relationships.reduce((accum, [key, desc]) => {
        var value = desc(data, key, this.registry);

        if (value !== undefined) {
          var resultKey = this.registry.keyTransformFunc(key); // eslint-disable-next-line no-param-reassign

          accum[resultKey] = value;
        }

        return accum;
      }, {}));
    }

    return result;
  }

  document(data) {
    return {
      data: _objectSpread({}, this.resource(data))
    };
  }

  parse(data, includesMap = null) {
    var result = {};
    result[this.idSpec.attr] = this.idSpec.parse(data);
    var attributes = this.registry.keyParseFunc(data.attributes || {});
    Object.entries(attributes).forEach(([name, value]) => {
      result[name] = value;
    });

    var getRelatedObject = link => {
      if (link) {
        if (includesMap) {
          var obj = includesMap["".concat(link.type, ":").concat(link.id)];

          if (obj) {
            return obj;
          }
        }

        return this.idSpec.parse(link);
      }

      return null;
    };

    var relationships = this.registry.keyParseFunc(data.relationships || {});
    Object.entries(relationships).forEach(([name, value]) => {
      if (Array.isArray(value.data)) {
        // TODO in debug version check for heterogeneous collections
        result[name] = value.data.map(getRelatedObject);
      } else if (value.data) {
        result[name] = value.data.id != null ? getRelatedObject(value.data) : null;
      } else if (value.data == null) {
        result[name] = null;
      }
    });
    return result;
  }

}

exports.default = Resource;