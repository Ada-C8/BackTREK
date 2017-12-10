import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  // These are properties!
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  validate: function(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors['name'] = ['Name cannot be blank!'];
    }
    if (!attributes.continent) {
      errors['continent'] = ['Continent cannot be blank!'];
    }
    if (!attributes.category) {
      errors['category'] = ['Category cannot be blank!'];
    }
    if (!attributes.weeks) {
      errors['weeks'] = ['Weeks cannot be blank'];
    }
    if (!attributes.cost) {
      errors['cost'] = ['Cost cannot be blank!'];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },

});

export default Trip;
