# Introduction

Say, you have a very simple blog API compatible with the [JSON:API specification](https://jsonapi.org/format/).

API defines the following resources:

`author` with the `name` and `email` attributes. Each author is related to zero or more articles.
`article` with the `title`, `text` and `published-at` attributes. Each article has exactly one author.

## Define resources

First, we need `registry`, an object which will hold definitions of our resources.

```js
import { Registry } from "@mykulyak/json-api";

const registry = new Registry({ transformKey: "kebab" });
```

Having registry we can define `resources`.

```js
registry.define("author", {
  attributes: ["name", "email"],
  relationships: {
    articles: "article"
  }
});

registry.define("article", {
  attributes: ["title", "text", "publishedAt"],
  relationships: {
    author: "author"
  }
});
```

With resources defined, we can ...

## Formatting resources

... transform data structures to JSON:API format

```js
registry.format("author", {
  id: 12,
  name: "John Dow",
  email: "john.dow@example.com"
});
```

which will return

```js
{
  type: 'author',
  id: '12',
  attributes: {
    name: 'John Dow',
    email: 'john.dow@example.com'
  },
  relationships: {
    articles: {
      data: null
    }
  }
}
```

## Parsing resources

We can also parse JSON:API documents to internal representation

```js
registry.parse({
  type: "author",
  id: "12",
  attributes: {
    name: "Jane Dow",
    email: null
  },
  relationships: {
    articles: {
      data: [
        { type: "article", id: "1" },
        { type: "article", id: "2" }
      ]
    }
  }
});
```

which will return

```js
{
  id: 12,
  name: 'Jane Dow',
  email: 'jane.dow@example.com',
  articles: [1, 2]
}
```
