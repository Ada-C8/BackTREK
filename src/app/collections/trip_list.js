import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips/',
  parse: function(response) {
    return response;
  },
  comparator: 'name',

  initialize: function () {
    this.model = Trip;
  }
});

export default TripList;
