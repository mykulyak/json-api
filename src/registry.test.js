import { expect } from 'chai';

import { Resource, relationship } from './request';
import { Registry } from './registry';

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

it('should install all models', () => {
  const registry = new Registry(Project, Task);

  expect(new registry.Project()).to.be.instanceof(Project);
  expect(new registry.Task()).to.be.instanceof(Task);
});
