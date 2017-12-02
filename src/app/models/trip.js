import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  validate: function(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors['name'] = ["Name cannot be blank"];
    }

    if (!attributes.continent) {
      errors['continent'] = ["Continent cannot be blank"];
    }

    if (!attributes.category) {
      errors['category'] = ["Category cannot be blank"];
    }

    if (!attributes.weeks) {
      errors['weeks'] = ["Number of weeks cannot be blank"];
    }

    if ( isNaN( attributes.weeks ) ) {
      errors['weeks'] = ["Weeks must be a number"];
    } else if ( parseInt(attributes.weeks) < 1 ) {
      errors['weeks'] = ["Number of weeks must be greater than than 0"];
    }

    if (!attributes.cost) {
      errors['cost'] = ["Cost cannot be blank"];
    }

    if ( isNaN( attributes.cost ) ) {
      errors['cost'] = ["Cost must be a number"];
    } else if ( parseInt(attributes.cost) < 1 ) {
      errors['cost'] = ["Cost must be greater than than 0"];
    }

    if ( Object.keys(errors).length > 0 ) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Trip;
