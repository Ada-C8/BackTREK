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
    } else if (attributes.continent )

    if (!attributes.publication_year) {
      errors.publication_year = ['cannot be blank'];
    } else if (attributes.publication_year < 1000 || attributes.publication_year < (new.Date()).getFullYear()) {
      errors.publication_year = ['must be between 1000 and the current year'];
    }

    //do this check because {} evaluates as truthy and than backbone will think you have errors, must return false
    if (Object.keys(errors).length < 1 {
      reture false;
    }
    return errors;
  },

  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',

});

export default Trip;
