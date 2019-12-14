import { expect } from 'chai';

import { Resource, attribute, relationship } from './request';
import { Registry } from './registry';

class CreateResource extends Resource {
  static resourceType = "create_resource";
  static fields = {
    displayName: attribute(),
    description: attribute(),
  };
}

class Project extends Resource {
  static resourceType = "project";
  static relationships = {
    tasks: relationship("Task"),
  };
}

class Task extends Resource {
  static resourceType = "task";
  static fields = {
    name: attribute(),
  };
  static relationships = {
    project: relationship('Project'),
  };
}

const registry = new Registry(Project, Task);

it('properly formats resource ID', () => {
  expect(CreateResource.id(12)).to.deep.equal({
    type: 'create_resource',
    id: '12',
  });
});

it('properly formats resources', () => {
  expect(CreateResource.resource({
    id: 879,
    displayName: 'name',
    description: 'description',
  })).to.deep.equal({
    type: 'create_resource',
    id: '879',
    attributes: {
      displayName: 'name',
      description: 'description',
    },
  });
});

it('does not include undefined IDs', () => {
  expect(CreateResource.resource({
  })).to.deep.equal({
    type: 'create_resource',
    attributes: {},
  });
});

it('does not include undefined attributes', () => {
  expect(CreateResource.resource({
    id: 456,
    displayName: undefined,
  })).to.deep.equal({
    type: 'create_resource',
    id: '456',
    attributes: {},
  });
});

it('uses attribute getters', () => {
  class CustomResource extends Resource {
    static resourceType = 'custom';
    static fields = {
      phoneNumber: attribute({ attribute: 'mobilePhone' }),
    };
  }

  expect(CustomResource.resource({
    id: 12,
    phoneNumber: '736 272 273',
    mobilePhone: '894 999 333',
  })).to.deep.equal({
    type: 'custom',
    id: '12',
    attributes: {
      phoneNumber: '894 999 333',
    },
  });
});

it('uses attribute formatters', () => {
  class CustomResource extends Resource {
    static resourceType = 'custom';
    static fields = {
      age: attribute({ formatter: Number }),
      skipIfNegative: attribute({ formatter: x => x < 0 ? undefined : x }),
    };
  }

  expect(CustomResource.resource({
    id: 89,
    age: '282',
    skipIfNegative: 10
  })).to.deep.equal({
    type: 'custom',
    id: '89',
    attributes: {
      age: 282,
      skipIfNegative: 10,
    },
  });

  expect(CustomResource.resource({
    id: 89,
    age: '282',
    skipIfNegative: -10
  })).to.deep.equal({
    type: 'custom',
    id: '89',
    attributes: {
      age: 282,
    },
  });
});

it('properly formats null relationship', () => {
  expect(registry.Task.resource({
    id: 99,
    name: 'task',
    project: null,
  })).to.deep.equal({
    type: 'task',
    id: '99',
    attributes: {
      name: 'task'
    },
    relationships: {
      project: { data: null },
    },
  });
});

it('properly formats non-null single relationship', () => {
  expect(registry.Task.resource({
    id: 99,
    name: 'task',
    project: 12,
  })).to.deep.equal({
    type: 'task',
    id: '99',
    attributes: {
      name: 'task',
    },
    relationships: {
      project: {
        data: {
          type: 'project',
          id: '12',
        },
      },
    },
  });
});

it('properly formats empty multiple relationships', () => {
  expect(registry.Project.document({
    id: 12,
    tasks: [],
  })).to.deep.equal({
    data: {
      type: 'project',
      id: '12',
      attributes: {},
      relationships: {
        tasks: {
          data: [],
        }
      },
    },
  });
});

it('properly formats multiple relationships', () => {
  expect(registry.Project.document({
    id: 12,
    tasks: [
      1,
      5,
      9,
    ],
  })).to.deep.equal({
    data: {
      type: 'project',
      id: '12',
      attributes: {},
      relationships: {
        tasks: {
          data: [
            {type: 'task', id: '1'},
            {type: 'task', id: '5'},
            {type: 'task', id: '9'},
          ],
        }
      },
    },
  });
});
