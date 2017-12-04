import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  parse(response) {
    response.forEach(function(tripAttrs){
      tripAttrs.name = tripAttrs.name.trim();
    });
    return response;
    console.log(response);
  },
});

export default TripList;
