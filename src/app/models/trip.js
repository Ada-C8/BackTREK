// Defining the Model

import Backbone from 'backbone';

const Trip = Backbone.Model.extend({


  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',

  validate: function(attributes) {
    const errors = {};
    const CONTINENTS = ['Asia', 'Africa', 'Australasia', 'Europe', 'South America', 'North America', 'asia', 'africa', 'australasia', 'europe', 'south america', 'north america']
    if (!attributes.name) {
      errors['name'] = [' cannot be blank.'];
    } //end name attribute

    if (!attributes.category) {
      errors.category = [' cannot be blank']
    }

    if (!attributes.continent) {
      errors.continent = [' cannot be blank'];
    }

    if (!CONTINENTS.includes(attributes.continent)) {
      errors.continent = [' is not a valid continent.'];
    }

    if (!attributes.weeks) {
      errors.weeks = [' cannot be blank'];
    } else if (Number(attributes.weeks)) {
      this.set("weeks", Number(attributes.weeks));
    } else if (!Number(attributes.weeks)){
      errors.weeks = [`"${ attributes.weeks }" is not a number`];
    }

    if (!attributes.cost) {
      errors.cost = [' cannot be blank'];
    } else if (Number(attributes.cost)) {
      this.set("cost", Number(attributes.cost));
    } else if (!Number(attributes.cost)){
      errors.cost = [`"${ attributes.cost }" is not a number`];
    }

    if (Object.keys(errors).length < 1) {
      return false;
    }

    console.log("Client Side Validation Failures");
    console.log(errors);
    return errors;

  }, //end validate

}); //end const Trip

export default Trip;




  // urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
// url: function() {
//   console.log(this);
//   return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.get("id");
// }



//
// urlRoot = 'https://ada-backtrek-api.herokuapp.com/trips'
