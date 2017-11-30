import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  url() {
    return this.url;
  },
  initialize(attributes, options) {
    this.url = options.url;
  },
  validate(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors['name'] = ['Name cannot be blank'];
    }

    if (!attributes.email) {
      errors['email'] = ['Email cannot be blank'];
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Trip;
