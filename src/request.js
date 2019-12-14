export class Resource {
  static id(id) {
    return {
      type: this.resourceType,
      id: id != null ? String(id) : null,
    };
  }

  static resource(data) {
    const result = {
      type: this.resourceType,
      attributes: Object.entries(this.fields).reduce((accum, [key, desc]) => {
        const value = desc(data, key);
        if (value !== undefined) {
          accum[key] = value;
        }
        return accum;
      }, {}),
    };

    let id;
    if (data.id === null) {
      id = null;
    } else if (data.id !== undefined) {
      id = String(data.id);
    }

    if (id !== undefined) {
      result.id = id;
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

export class Registry {
  constructor(...resources) {
    this.resources = resources;
  }
}

export const attribute = ({ formatter, attribute } = {}) => {
  const formatterFn = formatter || (x => x);
  return (data, key) => formatterFn(data[attribute == null ? key : attribute]);
};

export const relationship = () => {
  return () => null;
};
