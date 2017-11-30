import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  urlRoot: function () {
   return 'https://ada-backtrek-api.herokuapp.com/trips/' + this.attributes.tripId + '/reservations';
 },
});

export default Reservation;
