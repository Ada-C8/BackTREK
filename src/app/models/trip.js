import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  defaults: {
    category: 'N/A',
    about: 'N/A',
  },
  validate: function(attributes) {
    const errors = {};
    const continents = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];
    if (!attributes.name) {
      errors['Name'] = ['cannot be blank'];
    }
    if (!attributes.continent) {
      errors['Continent'] = ['cannot be blank'];
    } else if (!continents.includes(attributes.continent)) {
      errors['Continent'] = ['Africa, Antartica, Asia, Australasia, Europe, North America, South America'];
    }
    if (!attributes.weeks) {
      errors['Weeks'] = ['cannot be blank'];
    } else if (isNaN(!attributes.weeks)) {
      errors['Weeks'] = ['must be a number'];
    } else if (attributes.weeks <= 0) {
      errors['Weeks'] = ['must be greater than 0'];
    }
    if (!attributes.cost) {
      errors['Cost'] = ['cannot be blank'];
    } else if (isNaN(attributes.cost)) {
      errors['Cost'] = ['must be a number - leave off $']
    } else if (attributes.cost <= 0) {
      errors['Cost'] = ['must be greater than 0'];
    }
    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  }
});

export default Trip;
