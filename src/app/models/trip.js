import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  defaults: {
    category: 'Unknown',
    continent: 'Unknown',
    about: 'Unknown'
  },

  validate(attributes) {

    const errors = {};
    if (!attributes.name) {
      errors.name = ['cannot be blank'];
    }
    //
    // if (!attributes.continent) {
    //   errors.continent = ['cannot be blank'];
    // }
    //
    // if (!attributes.category) {
    //   errors.category = ['cannot be blank'];
    // }

    if (!attributes.weeks) {
      errors.weeks = ['cannot be blank'];
    } else if (attributes.weeks > 100) {
    errors.weeks = ['must be less than 100 weeks'];
    }

    if (!attributes.cost) {
      errors.cost = ['cannot be blank'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },

});

export default Trip;
