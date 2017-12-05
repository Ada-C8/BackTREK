import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips/',

  filterBy: function(field, value) {
    const newList = this.filter(function(trip) {
      if (['cost', 'weeks'].includes(field)){
        value = parseFloat(value);
        return value >= trip.get(field);
      } else {
        return trip.get(field).includes(value);
      }
    });
    return new TripList(newList);
  },
});

export default TripList;
