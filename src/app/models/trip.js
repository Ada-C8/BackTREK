import Backbone from 'backbone';

const Trip = Backbone.Model.extend ({
  defaults: {
    name: 'A trip into the Unknown',
    cost: 'Unknown',
    weeks: 'Unknown',
    continent: 'Unknown',
    about: 'An exciting surprise!',
    category: 'Unknown'
  },
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  idAttribute: 'id',
  validate: function(attributes) {
    const errors = {};
    if (!attributes.name) {
      errors['name'] = ['Cannot be blank'];
    }

    const CONTINENTS = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America']
    if (!attributes.continent) {
      errors['continent'] = ['Cannot be blank'];
    } else if (!CONTINENTS.includes(attributes.continent)) {
      errors['continent'] = ['Must be one of the 7 continents'];
    }

    if (!attributes.category) {
      errors['category'] = ['Cannot be blank'];
    }

    if (!attributes.weeks) {
      errors['weeks'] = ['Cannot be blank'];
    } else if (isNaN(attributes.weeks)) {
      errors['weeks'] = ['Must be a number'];
    } else if (attributes.weeks < 0) {
      errors['weeks'] = ['Must be more than 0'];
    }

    if (!attributes.cost) {
      errors['cost'] = ['Cannot be blank'];
    } else if (isNaN(attributes.weeks)) {
      errors['cost'] = ['Must be a number'];
    } else if (attributes.weeks < 0) {
      errors['cost'] = ['Must be more than 0'];
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  }
});

export default Trip;
