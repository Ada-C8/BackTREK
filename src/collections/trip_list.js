import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'http://ada-backtrek-api.herokuapp.com/trips',
  parse(response) {
    return response;
  }
});

export default TripList;
