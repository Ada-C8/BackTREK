
import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  initialize: function() {
    this.sort_key = 'id';
  },
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  comparator: function(a, b) {
    a = a.get(this.sort_key);
    b = b.get(this.sort_key);
    return (a > b ? 1 : (a < b ? -1 : 0));
  }
});

export default TripList;
