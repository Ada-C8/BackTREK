import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'http://localhost:3000/trips',

  // we need to override parse b/c our API returns
  // data in a weird format
  parse: function(response) {
    return response["trips"];
  },



  comparator: 'title',
});

export default TripList;
