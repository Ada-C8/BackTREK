import Backbone from 'backbone'

const Trip = Backbone.Model.extend({
  validate(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors.name = ['cannot be blank'];
    }

    if (!attributes.continent) {
      errors.continent = ['cannot be blank'];
    }

    if (!attributes.category) {
      errors.category = ['cannot be blank'];
    }

    if (!attributes.about) {
      errors.about = ['cannot be blank'];
    }

    if (!attributes.weeks) {
      errors.weeks = ['cannot be blank'];
    }

    if (!attributes.cost) {
      errors.cost = ['cannot be blank'];
    }
  } // validate
});

export default Trip;
