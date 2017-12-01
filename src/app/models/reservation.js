import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  url: function() {
    return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.get('tripID') + '/reservations'
  },
  // initialize: function(attributes) {
  //   console.log(attributes);
  // }
  // validate: function(attributes) {
  //   console.log(attriby)
  // }
});

export default Reservation
