import { expect } from "chai";

import Registry from "./Registry";

describe("Registry.define", () => {
  let registry;

  beforeEach(() => {
    registry = new Registry();
  });

  it("should be able to define a new resource", () => {
    const resource = registry.define("test", {});
    // eslint-disable-next-line no-unused-expressions
    expect(resource).to.not.be.null;
  });
});

describe("Registry.parse", () => {
  let registry;

  before(() => {
    registry = new Registry({ keyTransform: "kebab" });

    registry.define("survey-resource-type", {
      attributes: ["title", "startDate", "endDate"]
    });
  });

  it("should parse single resource with attributes", () => {
    expect(
      registry.parse({
        data: {
          type: "survey-resource-type",
          id: "12",
          attributes: {
            title: "First survey",
            "start-date": "2020-01-01",
            "end-date": "2020-01-31"
          }
        }
      })
    ).to.deep.equal({
      id: 12,
      title: "First survey",
      startDate: "2020-01-01",
      endDate: "2020-01-31"
    });
  });

  it("should parse multiple resources with attributes only", () => {
    expect(
      registry.parse({
        data: [
          {
            type: "survey-resource-type",
            id: "12",
            attributes: {
              title: "First"
            }
          },
          {
            type: "survey-resource-type",
            id: "34",
            attributes: {
              title: "Second"
            }
          }
        ]
      })
    ).to.deep.equal([
      { id: 12, title: "First" },
      { id: 34, title: "Second" }
    ]);
  });
});
