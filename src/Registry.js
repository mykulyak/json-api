import { kebabCaseDeep } from "./utils";
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
}

export const registry = new Registry();
