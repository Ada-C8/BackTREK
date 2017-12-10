import Backbone from 'backbone';
import Trip from '../models/trip';

const TripsList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips/',
  // parse: function(response) {
  //   return response['trips'];
  // } // NOTE may or may not need this parsing functionality not sure if should be trip or trips
});

export default TripsList;
