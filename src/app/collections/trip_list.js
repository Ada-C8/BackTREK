import Backbone from 'backbone';

//import model so collection knows what its a collection of:
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  parse: function(response) {
    return response;
  },
});

export default TripList;
