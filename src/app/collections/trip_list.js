import Backbone from 'backbone';

import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url:'https://ada-backtrek-api.herokuapp.com/trips',

// TODO: if time allows add filtering logic here
  // textSearch: function textSearch() {
  //   console.log('in text search');
  //
  //
  // },
});

export default TripList;
