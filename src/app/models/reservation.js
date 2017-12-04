import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  urlRoot() {
    return `https://ada-backtrek-api.herokuapp.com/trips/${ this.tripId }/reservations`
  },
});

export default Reservation
