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
  $('#trip-list').empty(); // clear it so it doesn't continually add on
  tripList.forEach((trip) => {
    // use template to append trip row to table in the DOM
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
  console.log(this)
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-row-template').html());

  $('#explore-trips').on('click', function() {$('#trip-table').show()});

  tripList.on('update', render, tripList)

  tripList.fetch(); // will automatically call render

  $('td').on('click', function() {console.log('click')})
});
