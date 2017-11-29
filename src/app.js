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
let trip = new Trip();

const render = function render(tripList) {
  $('#trip-list').empty(); // clear it so it doesn't continually add on
  tripList.forEach((trip) => {
    // use template to append trip row to table in the DOM
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
};

const events = {
  successfulGetTrip(trip, response) {
    console.log('got it!')
    console.log(trip)
  },
  failedGetTrip(trip, response) {

  },
};


$(document).ready( () => {
  tripTemplate = _.template($('#trip-row-template').html());

  $('#explore-trips').on('click', function() {$('#trip-table').show()});

  tripList.on('update', render, tripList)

  tripList.fetch(); // will automatically call render

  $('#trip-list').on('click', 'tr', function() {
    const id = $(this).attr('id');
    trip = tripList.get(id);
    trip.fetch({success: events.successfulGetTrip, error: events.failedGetTrip});
  })
});
