import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  model: Reservation,
  urlRoot: () => {
    return `https://ada-backtrek-api.herokuapp.com/trips/${this.get(tripId)}/reservations`
  }
});

export default Reservation
