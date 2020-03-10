const defaultAttributeSpec = {
  getter: (data, key) => data[key],
  formatter: value => value
};

export default class Resource {
  constructor(registry, type, attributes, relationships) {
    this.registry = registry;
    this.type = type;
    this.attributes = this.normalizeAttributes(attributes);
    this.relationships = this.normalizeRelationships(relationships, registry);
  }

  normalizeAttributes = specs => {
    if (Array.isArray(specs)) {
      return specs.map(spec => {
        if (typeof spec === "string") {
          return [spec, defaultAttributeSpec];
        }
        return spec;
      });
    }
    if (specs != null) {
      return Object.entries(specs).map(([key, value]) => [
        key,
        { ...defaultAttributeSpec, ...value }
      ]);
    }
    return [];
  };

  normalizeRelationships = (relationshipSpecs, registry) => {
    if (relationshipSpecs != null) {
      return Object.entries(relationshipSpecs).map(([key, value]) => {
        // eslint-disable-next-line no-shadow
        const getter = (data, key) => {
          let relatedResourceClass;
          if (typeof value === "string") {
            relatedResourceClass = registry.find(value);
          } else if (value instanceof Resource) {
            relatedResourceClass = value;
          } else {
            relatedResourceClass = registry.find(value.type);
          }

          if (!relatedResourceClass) {
            throw new Error(`Cannot find ${value} resource`);
          }

          // eslint-disable-next-line no-underscore-dangle
          const formatRelationship = value._embed
            ? r => relatedResourceClass.resource(r)
            : r => relatedResourceClass.link(r);

          const raw = data[key];
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
  };

  id(value) {
    return {
      type: this.type,
      id: value != null ? String(value) : null
    };
  }

  link(value) {
    return {
      type: this.type,
      id: value != null ? String(value) : null
    };
  }

  resource(data) {
    const result = {
      type: this.type
    };

    if (data.id === null) {
      result.id = null;
    } else if (data.id !== undefined) {
      result.id = String(data.id);
    }

    result.attributes = this.registry.keyTransformFunc(
      this.attributes.reduce((accum, [key, desc]) => {
        const value = desc.formatter(desc.getter(data, key));
        if (value !== undefined) {
          // eslint-disable-next-line no-param-reassign
          accum[key] = value;
        }
        return accum;
      }, {})
    );

    if (this.relationships != null) {
      result.relationships = this.registry.keyTransformFunc(
        this.relationships.reduce((accum, [key, desc]) => {
          const value = desc(data, key, this.registry);
          if (value !== undefined) {
            const resultKey = this.registry.keyTransformFunc(key);
            // eslint-disable-next-line no-param-reassign
            accum[resultKey] = value;
          }
          return accum;
        }, {})
      );
    }

    return result;
  }

  document(data) {
    return {
      data: {
        ...this.resource(data)
      }
    };
  }
}
