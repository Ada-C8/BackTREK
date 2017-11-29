import Backbone from 'backbone';

const Trip = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
  initialize: function(attributes) {
    console.log(`initializing trip ${trip.name}`);

  },

  validate: function(attributes) {
    console.log("what are the attributes?")
    console.log(attributes);

    //we want a place to put errors as they occur;
    const errors = {};
  }
});

export default Trip
