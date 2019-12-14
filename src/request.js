export class Resource {
  static id(id) {
    return {
      type: this.resourceType,
      id: id != null ? String(id) : null,
    };
  }

  static resource(data) {
    return {
      type: this.resourceType,
      id: data.id != null ? String(data.id) : null,
      attributes: Object.entries(this.fields).reduce((accum, [key, desc]) => {
        const value = desc(data, key);
        if (value !== undefined) {
          accum[key] = value;
        }
        return accum;
      }, {}),
    };
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
