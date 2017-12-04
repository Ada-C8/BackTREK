import Backbone from 'backbone';
import _underscore from 'underscore';

const Trip = Backbone.Model.extend({
  defaults: {
    category: 'everything',
  },
  // urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  validate: function(attributes){
    const errors = {
      name: [],
      continent: [],
      about: [],
      category: [],
      weeks: [],
      cost: []
    };
    console.log('in validate in Trip model');
    const tripFields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];

    // checks for blanks
    const blank_attributes = _underscore.difference(tripFields, Object.keys(attributes));
    if (blank_attributes.length > 0) {
      blank_attributes.forEach((attr) => {
        errors[attr].push('cannot be blank');
      });
    }
    console.log('Errors from Trip Model:');
    console.log(errors);

    const continents = ['africa', 'antarctica', 'asia', 'australasia', 'europe', 'south America', 'north America'];
    if (attributes.continent != undefined && !continents.includes(attributes.continent.toLowerCase())){
      errors['continent'].push('continent must be a valid continent name');
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return false;
    }
  }
});
export default Trip;
