import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  initialize(attr) {
    this.url = `https://ada-backtrek-api.herokuapp.com/trips/${attr.tripID}/reservations`;
  },
});

export default Reservation;
