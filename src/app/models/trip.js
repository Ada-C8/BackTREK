import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',

  validate: function(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors['name'] = ['Name can\'t be blank'];
    }

    if (!attributes.continent) {
      errors['continent'] = ['Continent can\'t be blank'];
    }

    if (!attributes.category) {
      errors['category'] = ['Category can\'t be blank'];
    }

    if (!attributes.weeks) {
      errors['weeks'] = ['Weeks can\'t be blank'];
    }

    if (!attributes.cost) {
      errors['cost'] = ['Cost can\'t be blank'];
    }

    if ( isNaN(attributes.weeks) ) {
      errors['weeks'] = ['Weeks must be a number'];
    }

    if ( isNaN(attributes.cost) ) {
      errors['cost'] = ['Cost must be a number'];
    }
  }
});

export default Trip
