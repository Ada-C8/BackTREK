import Backbone from 'backbone';
import Trip from '../models/trip';
import TripList from '../models/reservation';

const Reservation = Backbone.Collection.extend({
  urlRoot: function() {
    return `http://localhost:3000/trips/ ${this.get('tripId')}/reservations`;
  },
});
export default TripList;
