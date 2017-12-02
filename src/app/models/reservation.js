import Backbone from 'backbone';
import Trip from '../models/trip';
import TripList from '../models/reservation';

const Reservation = Backbone.Collection.extend({
  urlRoot: function() {
    return `http://localhost:3000/trips/ ${this.get('tripId')}/reservations`;
  },
  validate(attributes) {
    const resErrors = {};

    if (!attributes.name) {
      resErrors.name = ['cannot be blank']
    }

    if (!attributes.age) {
      resErrors.age = ['cannot be blank']
    }

    if (!attributes.email) {
      resErrors.email = ['cannot be blank']
    }

    if (Object.keys(resErrors).length < 1) {
      return false;
    }
    return resErrors;
  }
});
export default Reservation;
