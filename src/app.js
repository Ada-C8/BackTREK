// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our components
import TripList from './app/collections/trip_list';

const tripList = new TripList();

const TRIP_FIELDS = ["id", "name", "continent", "category", "weeks", "cost"];

let tripTemplate;

const render = function render(tripList) {
  // iterate through the bookList, generate HTML
  // for each model and attatch it to the DOM
  const tripTableElement = $('#trip-list');

  // clears the html so when we dynamically render again we get a new list vs just adding on
  tripTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  });
};

// let trip = {
//   "id":4,
//   "name":"Egypt \u0026 Jordan Adventure",
//   "continent":"Africa",
//   "about":"A wide-ranging adventure showcasing the regions natural wonders and fascinating cultures, offering the perfect combination of guided excursions and free time to explore at your own pace. Our expert local leaders will share with you the archaeological and historical secrets of the ancient sites of Petra, Luxor, and the Great Pyramids of Giza. Whether its haggling in Cairos bustling bazaars or snapping a desert sunset, Egypt and Jordan will be etched into your memory like a hieroglyph.",
//   "category":"historical",
//   "weeks":1,
//   "cost":855.53
// }

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());

  // adding new models to a collection triggers an update event
  tripList.on('update', render);

  // get all of the trips from the API
  tripList.fetch();
});
