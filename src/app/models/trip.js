import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  parse: function(response) {
    return response;
  },
  initialize: function(attributes) {
    console.log('Attributes from initialize function:');
    console.log(attributes);
    console.log(`In initialize for the trip ${attributes.name}`);
  },
  validate: function(attributes) {
    console.log('in the Trip validate function');
    console.log(attributes); //UNDEFINED
    //CAUSES ERROR- CANNOT READ PROPERTY OF 'NAME' OF UNDEFINED: console.log(attributes.name);
    const errors = {};

    if (!attributes.name) {
      errors['name'] = ["Trip name cannot be blank"];
    }
    if (!attributes.category) {
      errors['category'] = ["Category cannot be blank."];
    }
    if (!attributes.continent) {
      errors['continent'] = ["Continent cannot be blank."];
    }
    if (!attributes.cost) {
      errors['cost'] = ["Cost cannot be blank."];
    }
    if (!attributes.weeks) {
      errors['weeks'] = ["Weeks cannot be blank."];
    }

    const CONTINENTS = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];
    if (CONTINENTS.includes(attributes.continent)) {
      console.log('valid continent');
    } else {
      console.log('invalid continent');
      errors['continent'] = ["Continent must be: Africa, Antartica, Asia, Australasia, Europe, North America or South America"];
    }

    console.log(`errors: ${errors.keys}`);
    if ( Object.keys(errors).length > 0 ) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Trip;
