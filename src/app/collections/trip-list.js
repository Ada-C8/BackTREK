import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips/',

  filterBy: function(field, value) {
    console.log('you are here');
    const newList = this.filter(function(trip) {
      return trip.get(field) === value;
    });
    console.log('now you are here');
    return new TripList(newList);
  },
});

export default TripList;
