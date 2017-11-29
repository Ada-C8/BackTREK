import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',

  // we need to override parse b/c our API returns
  // // data in a weird format

  // comparator: 'title',
});

export default TripList;
