import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = BackBone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips',
  parse(response) {
    return response;
  }
})

export default TripList;
