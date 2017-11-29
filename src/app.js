// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// Vars that need to be defined up front
let tripTemplate;
let detailsTemplate;
let trip = new Trip();
const tripList = new TripList();

// Callback functions
const render = function render(tripList) {
  $('#trip-list').empty(); // clear it so it doesn't continually add on
  tripList.forEach((trip) => {
    // use template to append trip row to table in the DOM
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
};

const renderTripDetails = function renderTripDetails(trip) {
  console.log('triggered renderTripDetails');
  $('#trip-info').empty();
  $('#trip-info').append(detailsTemplate(trip.attributes))
};

const getTrip = function getTrip() {
  const id = $(this).attr('id');
  trip = tripList.get(id);
  trip.fetch({success: events.successfulGetTrip, error: events.failedGetTrip});
};

const events = {
  successfulGetTrip(trip, response) {
    console.log('got it!')
    console.log(trip)
    $('#trip-info').empty();
    $('#trip-info').append(detailsTemplate(trip.attributes))
    // trip.trigger('selected'); // trigger 'sync' eventHandler

  },
  failedGetTrip(trip, response) {

  },
};


$(document).ready( () => {
  tripTemplate = _.template($('#trip-row-template').html());
  detailsTemplate = _.template($('#trip-details-template').html());

  $('#explore-trips').on('click', function() {$('#trip-table').show()});

  tripList.on('update', render, tripList)

  tripList.fetch(); // will automatically call render

  trip.on('selected', renderTripDetails, trip) // listening for 'selected'. will render tripdetails

  $('#trip-list').on('click', 'tr', getTrip)
});
