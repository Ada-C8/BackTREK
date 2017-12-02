import Backbone from 'backbone';
import Trip from '../models/trip';
import TripList from '../models/reservation';

const Reservation = Backbone.Model.extend({
  urlRoot: function() {
    const tripId = this.get('trip_id');
    return `https://ada-backtrek-api.herokuapp.com/trips/${ tripId }/reservations`;
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
