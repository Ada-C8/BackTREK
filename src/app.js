// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const tripList = new TripList();
let tripTemplate;

const render = function render(tripList) {
  $('#trip-table').empty(); // clear it so it doesn't continually add on
  tripList.forEach((trip) => {
    // use template to append trip row to table in the DOM
    $('#trip-table').append(tripTemplate(trip.attributes));
  });
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-row-template').html());

  tripList.on('update', render, tripList)

  tripList.fetch(); // will automatically call render
});
