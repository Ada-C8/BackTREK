import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  parse: function(response) {
    return response;
  },
  defaults: {
    cost: "TBD",
  },
  initialize: function(attributes) {
    console.log(`In initialize for the trip ${this.get('name')}`);
  },
  validate: function(attributes) {
    console.log('in the Trip validate function');
    const errors = {};

    //TODO: Refactor the below to be a loop that loops through attributes and outputs all needed errors.
    //TODO: Figure out how to display these erros in the form as opposed to up top (like in the wireframe)
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
      errors['continent'] = ["Continent must be: Africa, Antartica, Asia, Australasia, Europe, North America or South America"];
    }

    console.log(errors);
    if ( Object.keys(errors).length > 0 ) {
      return errors;
    } else {
      return false;
    }
  },
});

export default Trip;
