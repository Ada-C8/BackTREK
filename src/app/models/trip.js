import Backbone from 'backbone';

const Trip = Backbone.Model.extend ({
  
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',

  parse(response) {
    return response
  },

  validate: function(attributes) {
    const errors = {};
    const continents = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America']

    if (!attributes.name) {
      errors['name'] = 'Name cannot be blank!';
    }

    if (!attributes.continent) {
      errors['continent'] = 'Continent cannot be blank!';
    } else if (!continents.includes(attributes.continent)) {
      errors['continent'] = 'Please only use actual continents!';
    }

    if (!attributes.category) {
      errors['category'] = 'The category cannot be blank!';
    }

    if (!attributes.weeks) {
      errors['weeks'] = 'Weeks cannot be blank!';
    } else if (isNaN(attributes.weeks)){
      errors['weeks'] = 'Numbers only please!';
    }

    if (!attributes.cost) {
      errors['cost'] = 'The cost cannot be blank!';
    } else if (isNaN(attributes.cost)) {
      errors['cost'] = 'Numbers only please!'
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Trip;
