import Backbone from 'backbone';

const CONTINENTS = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  validate(attributes) {
    const errors = {};

    if (!attributes.name) {
      errors['name'] = ['Name cannot be blank'];
    }

    if (!attributes.continent) {
      errors['continent'] = ['Continent cannot be blank'];
    } else if (!CONTINENTS.includes(attributes.continent)) {
      errors['continent'] = [`Continent must be valid (${CONTINENTS.join(', ')})`];
    }

    if (!attributes.category) {
      errors['category'] = ['Category cannot be blank'];
    }

    if (!attributes.weeks) {
      errors['weeks'] = ['Weeks cannot be blank'];
    } else if (attributes.weeks != parseInt(attributes.weeks)) {
      errors['weeks'] = ['Weeks must be an integer'];
    } else if (parseInt(attributes.weeks) <= 0) {
      errors['weeks'] = ['Weeks must be greater than 0'];
    }

    if (!attributes.cost) {
      errors['cost'] = ['Cost cannot be blank'];
    } else if (attributes.cost != parseFloat(attributes.cost)) {
      errors['cost'] = ['Cost must be a number'];
    } else if (parseFloat(attributes.cost) <= 0) {
      errors['cost'] = ['Cost must be greater than 0'];
    }

    if (!attributes.about) {
      errors['about'] = ['About cannot be blank'];
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Trip;
