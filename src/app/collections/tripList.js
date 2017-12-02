import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: `https://ada-backtrek-api.herokuapp.com/trips`,

// this is where the filter function goes
  // filter:
  //function(params){
	// }

});

export default TripList;
