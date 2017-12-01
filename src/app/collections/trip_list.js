import Backbone from 'backbone';
import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url: 'https://ada-backtrek-api.herokuapp.com/trips/',
  parse(response) {
    response.forEach(function(tripAttributes) {
      // ' Sloop John B.' made me realize leading/trailing spaces are a thing
      // Backbone considers spaces when alphabetizing
      tripAttributes.name = tripAttributes.name.trim();
      tripAttributes.continent = tripAttributes.continent.trim();
      tripAttributes.category = tripAttributes.category.trim();
    });
    return response;
  }
});

export default TripList;
