import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  idAttribute: 'id',
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips/1/reservations',
});

export default Reservation;
