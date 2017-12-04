import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  defaults: {
    about: "n/a",
  },

  initialize: function(attributes) {
    console.log("initializing: attributes:")
    console.log(attributes)
  },

  validate: function(attributes){
    console.log("what are the attributes?? Here: \n" + attributes);

    const errors = {}

    if (!attributes.name) {
      errors['name'] = "Trek name cannot be blank";
    }

    if (!attributes.about) {
      errors['about'] = "Cost cannot be blank";
    }

    if (!attributes.cost) {
      errors['cost'] = "Publication Year cannot be blank"
    }

    if (isNaN(parseInt(attributes.cost))) {
      errors['cost'] = "Publication Year must be a number"
    }

    if (parseInt(attributes.cost) < 0) {
      errors['publication_year'] = "Cost must be greater than 0"
    }

    // console.log(errors);
    if (Object.keys(errors).length > 0) {
      console.log(errors)
      return errors;
    } else {
      console.log(false);
      return false;
    }
  },

});

export default Trip
