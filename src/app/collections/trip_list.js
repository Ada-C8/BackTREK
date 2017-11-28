import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://trektravel.herokuapp.com/trips/',
 //  parse: function(response) {
 //   return response['books'];
 // } // may or may not need this parsing functionality
});

export default TripList;
