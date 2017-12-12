import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  initialize: function(attributes) {
    console.log('attributes here:');
    console.log(attributes);
  },
  // idAttribute: 'id',
  // urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/',
});

export default Reservation;
