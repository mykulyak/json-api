import { kebabCaseDeep, camelCaseDeep } from "./utils";
import Resource from "./Resource";

const identity = x => x;

export default class Registry {
  constructor(options) {
    this.options = options;
    this.resources = {};

    this.keyTransformFunc =
      this.options && this.options.keyTransform === "kebab"
        ? kebabCaseDeep
        : identity;
    this.keyParseFunc =
      this.options && this.options.keyTransform === "kebab"
        ? camelCaseDeep
        : identity;
  }

  define(type, spec) {
    const { attributes, relationships } = spec;
    const resource = new Resource(this, type, attributes, relationships);
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
    const resource = this.find(data.type);

    if (!resource) {
      throw new Error(`Cannot find resource ${data.type}`);
    }

    return resource.parse(data);
  }
}

export const registry = new Registry();
