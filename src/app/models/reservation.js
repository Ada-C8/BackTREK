import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  url: function() {
    return `https://ada-backtrek-api.herokuapp.com/trips/${this.get('trip_id')}/reservations`;
  }

});

export default Reservation;
