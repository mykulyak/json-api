import { expect } from 'chai';

import { Registry, Resource, attribute, relationship } from './request';

class CreateResource extends Resource {
  static resourceType = "create_resource";
  static fields = {
    displayName: attribute(),
    description: attribute(),
  };
}

class Project extends Resource {
  static resourceType = "project";
  static fields = {
    tasks: relationship("Task"),
  };
}

class Task extends Resource {
  static resourceType = "task";
  static fields = {
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

// it('properly formats documents', () => {
//   expect(CreateResource.document({
//     id: 879,
//     displayName: 'name',
//     description: 'description',
//   })).to.deep.equal({
//     data: {
//       type: 'create_resource',
//       id: '879',
//       attributes: {
//         displayName: 'name',
//         description: 'description',
//       },
//     },
//   });
// });

// it('properly formats null relationship', () => {
//   expect(registry.Task.resource({
//     id: 99,
//     project: null,
//   })).to.deep.equal({
//   });
// });

// it('properly formats multiple relationships', () => {
//   expect(registry.Project.document({
//     id: 12,
//     tasks: [],
//   })).to.deep.equal({
//     type: 'project',
//     id: '12',
//   });
// });
