import Backbone from 'backbone';
import Trip from '../models/trip';
import TripList from '../models/reservation';

const Reservation = Backbone.Collection.extend({
  model: Trip,


  // const tripId = this.get('tripId');
  // urlRoot: `http://localhost:3000/trips/`,

  // ${ tripId }/reservations`;

  urlRoot: function(tripId) {
    // const tripId = this.get('tripId');
    // if (isNaN(tripId)) {
    //   throw 'Cannot make a reservation w/o trip ID';
    // }
    return `http://localhost:3000/trips/${ tripId }/reservations`;
  },

});
export default TripList;
