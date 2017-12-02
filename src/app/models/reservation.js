import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  // initialize: function(attributes) {
  //   console.log(`In initialize for the trip ${this.get('id')} named ${this.get('name')}`);
  //
  // },
  urlRoot: `https://ada-backtrek-api.herokuapp.com/trips/${this.get('id')}/reservations`,
  parse: function(response) {
    return response;
  },
  validate: function(attributes) {
    console.log('in the Reservation validate function');
    const errors = {};
  },

});
