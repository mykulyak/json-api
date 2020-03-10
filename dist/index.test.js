"use strict";

var _chai = require("chai");

var _index = require("./index");

var registry = new _index.Registry();
var author = registry.define("author", {
  attributes: ["name", "email"],
  relationships: {
    articles: "article"
  }
});
var article = registry.define("article", {
  attributes: ["title", "content"],
  relationships: {
    author: "author",
    comments: "comment"
  }
});
var createArticle = registry.define("create-article", {
  attributes: ["title", "content"]
});
var comment = registry.define("comment", {
  attributes: ["content"],
  relationships: {
    article: "article"
  }
});
it("should be able to define a new resource", function () {
  var resource = registry.define("test", {});
  (0, _chai.expect)(resource).to.not.be["null"];
});
it("properly formats resource ID", function () {
  (0, _chai.expect)(author.id(12)).to.deep.equal({
    type: "author",
    id: "12"
  });
});
it("properly formats resources", function () {
  (0, _chai.expect)(createArticle.resource({
    title: "New article",
    content: "Article content ..."
  })).to.deep.equal({
    type: "create-article",
    attributes: {
      title: "New article",
      content: "Article content ..."
    }
  });
});
it("does not include undefined IDs", function () {
  (0, _chai.expect)(createArticle.resource({})).to.deep.equal({
    type: "create-article",
    attributes: {}
  });
});
it("uses attribute getters", function () {
  var custom = registry.define("custom", {
    attributes: {
      phoneNumber: {
        getter: function getter(data) {
          return data.mobilePhone;
        }
      }
    }
  });
  (0, _chai.expect)(custom.resource({
    id: 12,
    phoneNumber: "736 272 273",
    mobilePhone: "894 999 333"
  })).to.deep.equal({
    type: "custom",
    id: "12",
    attributes: {
      phoneNumber: "894 999 333"
    }
  });
});
it("uses attribute formatters", function () {
  var customRegistry = new _index.Registry();
  var custom = customRegistry.define("custom", {
    attributes: {
      age: {
        formatter: Number
      },
      skipIfNegative: {
        formatter: function formatter(x) {
          return x < 0 ? undefined : x;
        }
      }
    }
  });
  (0, _chai.expect)(custom.resource({
    id: 89,
    age: "282",
    skipIfNegative: 10
  })).to.deep.equal({
    type: "custom",
    id: "89",
    attributes: {
      age: 282,
      skipIfNegative: 10
    }
  });
  (0, _chai.expect)(custom.resource({
    id: 89,
    age: "282",
    skipIfNegative: -10
  })).to.deep.equal({
    type: "custom",
    id: "89",
    attributes: {
      age: 282
    }
  });
});
it("properly formats null relationship", function () {
  (0, _chai.expect)(comment.resource({
    id: 99,
    content: "comment !",
    article: null,
    author: 1245
  })).to.deep.equal({
    type: "comment",
    id: "99",
    attributes: {
      content: "comment !"
    },
    relationships: {
      article: {
        data: null
      }
    }
  });
});
it("properly formats non-null single relationship", function () {
  (0, _chai.expect)(comment.resource({
    id: 99,
    content: "task",
    article: 12
  })).to.deep.equal({
    type: "comment",
    id: "99",
    attributes: {
      content: "task"
    },
    relationships: {
      article: {
        data: {
          type: "article",
          id: "12"
        }
      }
    }
  });
});
it("properly formats empty multiple relationships", function () {
  (0, _chai.expect)(article.document({
    id: 12,
    comments: []
  })).to.deep.equal({
    data: {
      type: "article",
      id: "12",
      attributes: {},
      relationships: {
        author: {
          data: null
        },
        comments: {
          data: []
        }
      }
    }
  });
});
it("properly formats multiple relationships", function () {
  (0, _chai.expect)(article.document({
    id: 12,
    comments: [1, 5, 9]
  })).to.deep.equal({
    data: {
      type: "article",
      id: "12",
      attributes: {},
      relationships: {
        author: {
          data: null
        },
        comments: {
          data: [{
            type: "comment",
            id: "1"
          }, {
            type: "comment",
            id: "5"
          }, {
            type: "comment",
            id: "9"
          }]
        }
      }
    }
  });
});
it("handles embedding resources", function () {
  var registry = new _index.Registry({
    keyTransform: "kebab"
  });
  var author3 = registry.define("author", {
    attributes: ["name"],
    relationships: {
      articles: {
        type: "article",
        _embed: true
      }
    }
  });
  registry.define("article", {
    attributes: ["title"]
  });
  (0, _chai.expect)(author3.document({
    id: 1,
    name: "author",
    articles: [{
      id: 1,
      title: "first"
    }, {
      id: 2,
      title: "second"
    }]
  })).to.deep.equal({
    data: {
      type: "author",
      id: "1",
      attributes: {
        name: "author"
      },
      relationships: {
        articles: {
          data: [{
            type: "article",
            id: "1",
            attributes: {
              title: "first"
            }
          }, {
            type: "article",
            id: "2",
            attributes: {
              title: "second"
            }
          }]
        }
      }
    }
  });
});
it("handles transform=kebab option properly", function () {
  var registry2 = new _index.Registry({
    keyTransform: "kebab"
  });
  registry2.define("author", {
    attributes: ["firstName", "email"],
    relationships: {
      articles: "article"
    }
  });
  var article2 = registry2.define("article", {
    attributes: ["title", "fullContent"],
    relationships: {
      author: "author",
      commentList: "comment"
    }
  });
  registry2.define("comment", {
    attributes: ["textContent", "formattedContent"],
    relationships: {
      article: "article"
    }
  });
  (0, _chai.expect)(article2.document({
    id: 12,
    title: "Article title",
    fullContent: "Lorem ipsum ... no i tak dalej",
    commentList: [1, 5, 9]
  })).to.deep.equal({
    data: {
      type: "article",
      id: "12",
      attributes: {
        title: "Article title",
        "full-content": "Lorem ipsum ... no i tak dalej"
      },
      relationships: {
        author: {
          data: null
        },
        "comment-list": {
          data: [{
            type: "comment",
            id: "1"
          }, {
            type: "comment",
            id: "5"
          }, {
            type: "comment",
            id: "9"
          }]
        }
      }
    }
  });
});