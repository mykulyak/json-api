export class Resource {
  static fields = {};

  static id(id) {
    return {
      type: this.resourceType,
      id: id != null ? String(id) : null,
    };
  }

  static link(id) {
    return {
      type: this.resourceType,
      id: id != null ? String(id) : null,
    };
  }

  static resource(data) {
    const result = {
      type: this.resourceType,
    };

    if (data.id === null) {
      result.id = null;
    } else if (data.id !== undefined) {
      result.id = String(data.id);
    }

    result.attributes = Object.entries(this.fields).reduce((accum, [key, desc]) => {
      const value = desc(data, key);
      if (value !== undefined) {
        accum[key] = value;
      }
      return accum;
    }, {});

    if (this.relationships != null) {
      result.relationships = Object.entries(this.relationships).reduce((accum, [key, desc]) => {
        const value = desc(data, key, this.registry);
        if (value !== undefined) {
          accum[key] = value;
        }
        return accum;
      }, {});
    }

    return result;
  }

  // static link(data) {
  //   if (Array.isArray(data)) {
  //     return data.map();
  //   } else if (data ) {
  //     return 
  //   } else {
  //     return { data: null };
  //   }
  // }

  static document(data) {
    return {
      data: {
        ...this.resource(data),
      }
    };
  }
}

export const attribute = ({ formatter, attribute } = {}) => {
  const formatterFn = formatter || (x => x);
  return (data, key) => formatterFn(data[attribute == null ? key : attribute]);
};

export const relationship = name => {
  return (data, key, registry) => {
    const raw = data[key];
    if (raw != null) {
      const relatedResourceClass = registry[name];
      return {
        data: relatedResourceClass.link(raw),
      };
    }
    return {
      data: null
    };
  };
};
