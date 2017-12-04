import Backbone from 'backbone'

const Trip = Backbone.Model.extend({

  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
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

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  } // validate
});

export default Trip;
