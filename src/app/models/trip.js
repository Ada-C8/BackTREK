import Backbone from 'backbone';

const Trip = Backbone.Model.extend({

  validate(attributes) {
    const CONTINENTS = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];

    const errors = {};
    if (!attributes.name) {
      errors.name = ['cannot be blank'];
    }

    if (!attributes.continent) {
      errors.continent = ['cannot be blank'];
    } else if (!CONTINENTS.includes(attributes.continent)) {
      errors.continent = [`must be one of these: ${CONTINENTS}`]
    }

    if (!attributes.weeks) {
      errors.weeks = ['cannot be blank'];
    } else if (attributes.weeks < 1) {
      errors.weeks = ['must be greater than 0']
    }

    if (!attributes.cost) {
      errors.cost = ['cannot be blank'];
    } else if (attributes.weeks < 1) {
      errors.cost = ['must be greater than 0']
    }

    //do this check because {} evaluates as truthy and than backbone will think you have errors, must return false
    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  },

  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',

});

export default Trip;
