import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',

  validate(attributes) {
    const errors = {};

    const continents = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];

    if (!attributes.name) {
      errors['name']= ['Cannot be blank'];
    }

    if (!attributes.continent) {
      errors['continent'] = ['Cannot be blank'];
    } else if (!continents.includes(attributes.continent)) {
      errors['continent'] =['Is not a continent in the list'];
    }

    if (!attributes.category) {
      errors['category'] = ['Cannot be blank'];
    }

    if (!attributes.weeks) {
      errors['weeks'] = ['Cannot be blank'];
    } else if (isNaN(attributes.weeks)) {
      errors['weeks'] = ['Must be a number'];
    } else if (attributes.weeks <= 0) {
      errors['weeks']= ['Must be greater than 0'];
    }

    if (!attributes.cost) {
      errors['cost']= ['Cannot be blank'];
    } else if (isNaN(attributes.cost)) {
      errors['cost'] = ['Must be a number'];
    } else if (attributes.weeks <= 0) {
      errors['cost'] = ['Must be greater than 0'];
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    }
    return false;
  },
});

export default Trip;
