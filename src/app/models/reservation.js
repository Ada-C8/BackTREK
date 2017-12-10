import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  // urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
  // url: function () {
  //   return `${ this.urlRoot }/${ this.get('trip_id') }/reservations`;
  // },
  url: function () {
    return `https://ada-backtrek-api.herokuapp.com/trips/${ this.get('trip_id') }/reservations`;

});

export default Reservation;
