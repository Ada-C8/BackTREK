import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  // url: function() {
  //   return this.urlRoot + this.id;
  //   console.log(this.id);
  // }

  validate(attributes) {
    // const continents = []
    const errors = {};
    if (!attributes.name) {
      errors.name = ['can\'t be blank'];
    }

    if (!attributes.continent) {
      errors.continent = ['can\'t be blank'];
    }

    if (!attributes.category) {
      errors.category = ['can\'t be blank'];
    }

    if (!attributes.cost) {
      errors.cost = ['can\'t be blank'];
    }
    // else if (isNAN(attributes.cost)) {
    //   errors.cost = ['is not a number'];
    // }

    if (!attributes.weeks) {
      errors.weeks = ['can\'t be blank'];
    } 
    // else if (isNAN(attributes.weeks)) {
    //   errors.weeks = ['is not a number'];
    // }

    if (Object.keys(errors).length < 1) {
      return false;
    }
    return errors;
  }//end of validations
});

// continent
// :
// ["is not included in the list"]



export default Trip;
