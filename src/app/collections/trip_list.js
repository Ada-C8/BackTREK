import Backbone from 'backbone';
import Trip from '../models/trip'

const TripList = Backbone.Collection.extend({
  model: Trip,

  // url:'http://localhost:3000/books',
  // parse: function(response) {
  //   return response['books'];
  // },
  //
  // comparator: 'title',
});


export default TripList;
