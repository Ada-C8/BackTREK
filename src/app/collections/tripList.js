import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: `https://ada-backtrek-api.herokuapp.com/trips`
  // url: function(id){
  //   let j = 'https://ada-backtrek-api.herokuapp.com/trips/' + this.id;
  //   console.log(`what is this? ${this}`)
  //   return j
  // }
  // parse: function(response) {
  //   console.log('this is the response')
  //   console.log(response);
  // return response['books'];
  //  }
});

export default TripList;
