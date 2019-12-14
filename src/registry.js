export class Registry {
  constructor(...resources) {
    const self = this;

    resources.forEach(res => {
      class ResourceModel extends res {
        static registry = self;
      }

      this[res.name] = ResourceModel;
    });
  }
}
