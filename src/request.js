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
        accum[key] = desc(data, key);
        return accum;
      }, {}),
    };
  }

  static document(data) {
    return {
      data: {
        ...this.resource(data),
      }
    };
  }
}

export const attribute = () => {
  return (data, key) => data[key];
};
