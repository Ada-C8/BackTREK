import Backbone from 'backbone';
import _underscore from 'underscore';

const Trip = Backbone.Model.extend({
  defaults: {
    category: 'everything',
  },
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  validate: function(attributes){
    const errors = {
      name: [],
      continent: [],
      about: [],
      category: [],
      weeks: [],
      cost: []
    };

    let hasErrors = false;
    const tripFields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];

    // checks for blanks
    const blank_attributes = _underscore.difference(tripFields, Object.keys(attributes));
    if (blank_attributes.length > 0) {
      hasErrors = true;
      blank_attributes.forEach((attr) => {
        errors[attr].push('cannot be blank');
      });
    }

    const continents = ['africa', 'antarctica', 'asia', 'australasia', 'europe', 'south america', 'north america'];
    if (attributes.continent != undefined && !continents.includes(attributes.continent.toLowerCase())){
      hasErrors = true;
      errors['continent'].push('continent must be a valid continent name');
    }

    if (hasErrors) {
      return errors;
    } else {
      return false;
    }
  }
});
export default Trip;
