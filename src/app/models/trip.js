import Backbone from 'backbone';

const Trip = Backbone.Model.extend ({

  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',

  parse(response) {
    return response
  },

  validate: function(attributes) {
    const error = {};
    const continents = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America']

    if (!attributes.name) {
      error['name'] = 'Name cannot be blank!';
    }

    if (!attributes.continent) {
      error['continent'] = 'Continent cannot be blank!';
    } else if (!continents.includes(attributes.continent)) {
      error['continent'] = 'Please only use actual continents!';
    }

    if (!attributes.category) {
      error['category'] = 'The category cannot be blank!';
    }

    if (!attributes.weeks) {
      error['weeks'] = 'Weeks cannot be blank!';
    } else if (isNaN(attributes.weeks)){
      error['weeks'] = 'Numbers only please!';
    }

    if (!attributes.cost) {
      error['cost'] = 'The cost cannot be blank!';
    } else if (isNaN(attributes.cost)) {
      error['cost'] = 'Numbers only please!'
    }

    if (Object.keys(error).length > 0) {
      return error;
    } else {
      return false;
    }
  },
});

export default Trip;
