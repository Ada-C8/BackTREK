import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  url: function () {
    return `https://ada-backtrek-api.herokuapp.com/trips/${this.get('id')}/reservations`;
  }
});

export default Reservation;
