const defaultAttributeSpec = {
  getter: (data, key) => data[key],
  formatter: value => value,
};

export class Resource {
  constructor(registry, type, attributes, relationships) {
    this.registry = registry;
    this.type = type;
    this.attributes = this.normalizeAttributes(attributes);
    this.relationships = this.normalizeRelationships(relationships, registry);
  }

  normalizeAttributes(specs) {
    if (Array.isArray(specs)) {
      return specs.map(spec => {
        if (typeof spec === 'string') {
          return [spec, defaultAttributeSpec];
        }
        return spec;
      });
    } else if (specs != null) {
      return Object.entries(specs).map(([key, value]) => ([key, { ...defaultAttributeSpec, ...value }]));
    }
    return [];
  }

  normalizeRelationships(relationshipSpecs, registry) {
    if (relationshipSpecs != null) {
      return Object.entries(relationshipSpecs).map(([key, value]) => {
        const getter = (data, key) => {
          const relatedResourceClass = typeof value === 'string' ? registry.find(value) : value;
          if (!relatedResourceClass) {
            throw new Error(`Cannot find ${value} resource`);
          }
  
          const raw = data[key];
          if (Array.isArray(raw)) {
            return {
              data: raw.map(r => relatedResourceClass.link(r)),
            };
          } else if (raw != null) {
            return {
              data: relatedResourceClass.link(raw),
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

  id(value) {
    return {
      type: this.type,
      id: value != null ? String(value) : null,
    };
  }

  link(value) {
    return {
      type: this.type,
      id: value != null ? String(value) : null,
    };
  }

  resource(data) {
    const result = {
      type: this.type,
    };

    if (data.id === null) {
      result.id = null;
    } else if (data.id !== undefined) {
      result.id = String(data.id);
    }

    result.attributes = this.attributes.reduce((accum, [key, desc]) => {
      const value = desc.formatter(desc.getter(data, key));
      if (value !== undefined) {
        accum[key] = value;
      }
      return accum;
    }, {});

    if (this.relationships != null) {
      result.relationships = this.relationships.reduce((accum, [key, desc]) => {
        const value = desc(data, key, this.registry);
        if (value !== undefined) {
          accum[key] = value;
        }
        return accum;
      }, {});
    }

    return result;
  }

  document(data) {
    return {
      data: {
        ...this.resource(data),
      }
    };
  }
}

export class Registry {
  constructor() {
    this._resources = {};
  }

  define(type, spec) {
    const { attributes, relationships } = spec;
    const resource = new Resource(this, type, attributes, relationships);
    this._resources[type] = resource;
    return resource;
  }

  find(type) {
    return this._resources[type];
  }
}

export const registry = new Registry();
