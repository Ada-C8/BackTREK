import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip, //send it an object as a parameter
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  parse(response) {
    return response; //array from the JSON
  },
});

export default TripList;
