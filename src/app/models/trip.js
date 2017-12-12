import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  sPluralize(word, qty) { // TODO: These helpers don't belong here, but tried a method to see if I could use everything in the template...
    if (qty === 1) {
      return word;
    }
    return `${word}s`;
  },
  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  },
  validate: function(attributes) {
    const errors = {};
    if (!attributes.name) {
      errors['name'] = ['Cannot be blank'];
    }
    // TODO: How to validate uniqueness from model

    if (!attributes.category) {
      errors['category'] = ['Cannot be blank'];
    }

    const continents = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];
    if (!attributes.weeks) {
      errors['weeks'] = ['Cannot be blank'];
    } else if (!continents.includes(attributes.continent)) {
      errors['continent'] = ['Must be one of these continents: Africa, Antartica, Asia, Australasia, Europe, North America, South America'];
    }

    if (!attributes.weeks) {
      errors['weeks'] = ['Cannot be blank'];
    } else if (isNaN(attributes.weeks)) {
      errors['weeks'] = ['Must be a number'];
    } else if (attributes.weeks <= 0) {
      errors['weeks'] = ['Must be a positive number'];
    }

    if (!attributes.cost) {
      errors['cost'] = ['Cannot be blank'];
    } else if (isNaN(attributes.cost)) {
      errors['cost'] = ['Must be a number'];
    } else if (attributes.cost <= 0) {
      errors['cost'] = ['Must be a positive number'];
    }


    // Return false if it's valid,
    // or something truthy (i.e. the errors) if it's not valid
    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  }
});

export default Trip;
