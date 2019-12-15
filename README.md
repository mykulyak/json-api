# json-api

JSON:API request &amp; response helpers. 

![Travis](https://travis-ci.org/mykulyak/json-api.svg?branch=master)

## Why json-api ?

Because formatting and parsing [JSON:API](https://jsonapi.org/) data by hand is tedious and error-prone.

## Install

Install from the NPM repository using `npm` or `yarn`.

```shell
npm install @mykulyak/json-api
```

```shell
yarn add @mykulyak/json-api
```

## Quick start

Consider a simple blog API designed according to JSON:API spec. It returns article, author and comment resources:

- author may have zero or more articles
- article has one author
- article may have zero or more comments

The API request for creating a new article might look somethling like this:

```json
{
  "data": {
    "type": "create-article",
    "attributes": {
      "title": "Why should we use JSON:API ?",
      "content": "..."
    },
    "relationships": {
      "author": {
        "type": "author",
        "id": "123"
      }
    }
  },
  "jsonapi": { "version": "1.0" }
}
```

whereas in the application we would likely have the data look like:

```json
{
  "authorId": 123,
  "title": "Why should we use JSON:API ?",
  "content": "..."
}
```

Using `json-api`, one can build the request from form data in the following way:

```js
import { registry, attribute, relationship } from '@mykulyak/json-api';

const author = registry.resource({
  type: 'author',
});

const createArticle = registry.resource({
  type: 'create-article',
  attributes: ['title', 'content'],
  relationships: {
    author: {
      attribute: 'authorId',
      resource: author,
    },
  },
});

const request = createArticle.build({
  authorId: 123,
  title: "Why should we use JSON:API ?",
  content: "..."
});
```

## Documentation

TODO.

What should be there:

- resource definition
- request formatting
- response parsing & mapping (including redux-orm)

## Examples

TODO.

Perhaps above-mentioned blog API would be a good example.

## Dependencies

None.

## Credits

TODO.
