import { expect } from 'chai';

import { Resource, attribute } from './request';

class CreateResource extends Resource {
  static resourceType = "create_resource";
  static fields = {
    displayName: attribute(),
    description: attribute(),
  };
}

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

it('properly formats documents', () => {
  expect(CreateResource.document({
    id: 879,
    displayName: 'name',
    description: 'description',
  })).to.deep.equal({
    data: {
      type: 'create_resource',
      id: '879',
      attributes: {
        displayName: 'name',
        description: 'description',
      },
    },
  });
});
