import Backbone from 'backbone';
import Trip from '../models/reservation';


const Reservationlist = Backbone.Collection.extend({
  model: Reservation,
  url: `https://ada-backtrek-api.herokuapp.com/trips/${id}/reservations`

  parse(response) {
    return response
  },
});


export default Reservationlist;
