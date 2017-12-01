import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  parse(response) {
    return response
  },
  byAttribute: function(attribute, value) {
    const filtered = this.filter(function (trip) {
      return trip.get(attribute) === value;
    });
    return new TripList(filtered);
  }
});

export default TripList;
