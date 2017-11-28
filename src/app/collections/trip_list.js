import Backbone from 'backbone';
import Trip from '../models/trip';

const Triplist = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  // comparator: 'title',
  // parse: function(response) {
  //   return response["books"];
  // }
});

export default Triplist;
