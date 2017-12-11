import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  parse: function(response) {
    return response;
  },
  filterBy: function(filterCategory, query) {
    if (query === '') {
      return this;
    }
    if (filterCategory === 'weeks' || filterCategory === 'cost') {
      return this.where(trip => trip.get(filterCategory) <= Number(query));
    } else {
      return this.where((trip) => trip.get(filterCategory).toLowerCase().includes(query));
    }
  },
});

export default TripList;
