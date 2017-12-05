import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',

  // we need to override parse b/c our API returns
  // data in a weird format
  parse: function(response) {
    console.log(response);
    return response;
  },



  comparator: 'id',
});

export default TripList;
