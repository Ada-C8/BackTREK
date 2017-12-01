import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  urlRoot: 'https://ada-backtrek-api.herokuapp.com/trips',
});

export default Reservation;
