import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  parse: function(response) {
    return response.trips; // it looks like the api is set up concisely... maybe I don't need to parse 
  },
  comparator: 'name',
});

export default TripList;
