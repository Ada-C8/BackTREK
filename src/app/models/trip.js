import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  model: Trip,
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  initialize: function() {
      this.fetch();
  },

  validate(attributes) {
    const errors = {};
    if (!attributes.name) {
      errors.name = ['cannot be blank'];
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
  },

  defaults: {
    category: 'None provided',
    continent: 'None provided',
    about: 'None provided',

  },
});

export default Trip;
