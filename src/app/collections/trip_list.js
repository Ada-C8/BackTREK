import Backbone from 'backbone';

import Trip from '../models/trip';

const TripList = Backbone.Collection.extend({
  model: Trip,
  url:'https://ada-backtrek-api.herokuapp.com/trips',
  // comparator:

  textSearch: function textSearch() {
    console.log('in text search');

//     var str = "The rain in SPAIN stays mainly in the plain";
// var res = str.match(/ain/g);

// var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
//
// const result = words.filter(word => word.length > 6);

// console.log(result);
// expected output: Array ["exuberant", "destruction", "present"]


  },
//   For a text field (Name, Category, Continent), the trip's value for that field should include the filter value.
// Filtering for Continent asia should match both Asia and Australasia
// For a numeric field (Weeks, Cost), the trip's value for that field should be less than or equal to the filter value.
});

export default TripList;
