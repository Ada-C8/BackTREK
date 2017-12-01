import Backbone from 'backbone';
//collection needs to know what model it contains
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  // parse: function(response){
  //   return response['trips'];
  comparator: 'name', //default comparator, will have it sort by title by default
  filterSearch: function filterSearch(letters, selectedHeader) {
    console.log('In filterSearch');
    console.log(`Current letters: ${letters}`);
    console.log(`Current selectedHeader: ${selectedHeader}`);

    console.log(`Current tripList?: ${this.toJSON()}`);
  },

});

export default TripList;
