import Backbone from 'backbone';
import Reservation from '../models/reservation';

const ReservationList = Backbone.Collection.extend({
  model: Reservation,

  url: function() {
    // return `https://ada-backtrek-api.herokuapp.com/trips/${this.id}/reservations`
  },

  parse(response) {
    return response
  },
});

export default ReservationList;
