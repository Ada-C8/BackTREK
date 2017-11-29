import Backbone from 'backbone'
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  parse: function(response) {
    // it works!
    console.log('in parse', response);
    return response;
  }
});


export default TripList;
