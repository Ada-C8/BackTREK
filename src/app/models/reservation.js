import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  // initialize(attr) {
  //   this.url = `https://ada-backtrek-api.herokuapp.com/trips/${attr.tripID}/reservations`;
  // },
  urlRoot() {
    return `https://ada-backtrek-api.herokuapp.com/trips/${ this.get('tripID') }/reservations`;
  },
  // id: tripID
});

export default Reservation;
