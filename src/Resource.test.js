import { expect } from "chai";

import Registry from "./Registry";

describe("Resource.format", () => {
  let registry;
  let author;

  beforeEach(() => {
    registry = new Registry();
    author = registry.define("author", {});
  });

  it("properly formats resource ID", () => {
    expect(author.id(12)).to.deep.equal({
      type: "author",
      id: "12"
    });
  });

  it("does not include undefined IDs", () => {
    expect(author.resource({})).to.deep.equal({
      type: "author",
      attributes: {}
    });
  });

  it("uses attribute formatters", () => {
    const custom = registry.define("custom", {
      attributes: {
        age: { formatter: Number },
        skipIfNegative: { formatter: x => (x < 0 ? undefined : x) }
      }
    });

    expect(
      custom.resource({
        id: 89,
        age: "282",
        skipIfNegative: 10
      })
    ).to.deep.equal({
      type: "custom",
      id: "89",
      attributes: {
        age: 282,
        skipIfNegative: 10
      }
    });

    expect(
      custom.resource({
        id: 89,
        age: "282",
        skipIfNegative: -10
      })
    ).to.deep.equal({
      type: "custom",
      id: "89",
      attributes: {
        age: 282
      }
    });
  });
});
