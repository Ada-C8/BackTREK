import Backbone from 'backbone';

const Reservation = Backbone.Model.extend({
  initialize(attributes) {
    console.log("i'm in the initialize function. Above is attributes")
    console.log(attributes);
    this.url = 'https://ada-backtrek-api.herokuapp.com/trips/' + attributes.trip_id + '/reservations'
  }
});

export default Reservation
