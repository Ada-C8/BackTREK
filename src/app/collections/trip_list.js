import Backbone from 'backbone';
import Trip from '../models/trip'

const TripList = Backbone.Collection.extend({
  model: Trip,

  url:'https://ada-backtrek-api.herokuapp.com/trips',
  parse: function(response) {
    console.log(response);
    return response;
  },

  // comparator: 'title',
});


export default TripList;
