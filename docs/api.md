# API

## Registry

`Registry` object serves as a point of interaction with the library. It holds definitions or API resources, as well as global options.

### constructor(options)

Constructs a new registry object.

- `options.keyTransform` - if omitted, attribute and relationship names (collectively called field names hereafter) are not transformed. If set to `kebab`, field names are transformed from `camelCase` to `kebab-case`.

Usage:

```js
import { Registry } from "@mykulyak/json-api";

const registry = new Registry({ keyTransform: "kebab" });
```

### define(type, spec)

Defines [JSON:API resource](https://jsonapi.org/format/#document-resource-objects) with given `type` and specification. For more details, see documentation of the `Resource` constructor.

### find(type)

Finds and returns `Resource` object for given resource type.

### parse(document)

Parses JSON:API document.

## Resource

### constructor(registry, type, attributes, relationships)

Resource specification might include the following fields:

- `attributes` - list of attribute specifications
- `relationships` - map of relationship specifications

### link(value)

Formats [resource link](https://jsonapi.org/format/#document-resource-object-identification).

### resource(data)

Formats [resource object](https://jsonapi.org/format/#document-resource-object-identification).

### document(dataObj)

Formats [document](https://jsonapi.org/format/#document-resource-object-identification) whose top level `data` attributes will consists of resources formatted from `dataObj`.

### parse(jsonApiData, includesMap = null)

Parses [document](https://jsonapi.org/format/#document-resource-object-identification) or [resource object](https://jsonapi.org/format/#document-resource-object-identification).
