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

  },

});

export default Trip
