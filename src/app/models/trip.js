import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  url: function() {
    if (this.get('id')) {
    return `https://ada-backtrek-api.herokuapp.com/trips/${ this.get('id')}`;
  }
    return 'https://ada-backtrek-api.herokuapp.com/trips/';
  },
  validate: function(attributes) {
    const errors = {};
    const CONTINENTS = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];
    if (!attributes.name) {
      errors['name'] = ['Cannot be blank'];
    }

    if (!attributes.continent) {
      errors['continent'] = ['Cannot be blank'];
    } else if (!CONTINENTS.includes(attributes.continent)) {
      errors['continent'] = ['Must be a valid continent'];
    }

    if (!attributes.category) {
      errors['category'] = ['Cannot be blank'];
    }

    if (!attributes.weeks) {
      errors['weeks'] = ['Cannot be blank'];
    } else if (isNaN(attributes.weeks)) {
      errors['weeks'] = ['Must be a number'];
    } else if (attributes.weeks < 1) {
      errors['weeks'] = ['Must be greater than 0'];
    }

    if (!attributes.cost) {
      errors['cost'] = ['Cannot be blank'];
    } else if (isNaN(attributes.cost)) {
      errors['cost'] = ['Must be a number'];
    } else if (attributes.cost <= 0) {
      errors['cost'] = ['Must be greater than 0'];
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  }
});

export default Trip;
