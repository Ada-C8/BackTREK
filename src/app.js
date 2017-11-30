// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// MODELS
import Trip from './app/models/trip';

// COLLECTION
import TripList from './app/collections/trip_list';

// INITITAL SET UP CHECK
console.log('it loaded!');

const tripList = new TripList();
// console.log('TRIPLIST:');
// console.log(tripList);

let tripTemplate;

const render = function render(tripList) {
  console.log('TOP OF RENDER')
  console.log(tripList);
  const $tripList = $('#trip-list');
  //Clears the list so when you re-render it doesn't print duplicates
  $tripList.empty();

  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
    console.log(trip.attributes);
  });
};

const loadTrips = function loadTrips() {
  tripList.fetch();
  tripList.on('update', render, tripList);
};

let singleTripTemplate;

const getTripDetails = function getTripDetails(attrID) {
  console.log('View Trip Row clicked');

  const trip = new Trip({ id: attrID });
  trip.fetch({success: events.renderSingleTrip, error: events.failRenderTrip});

  console.log(trip)

  // $('#reservation-form').hide();
};

const events = {
  renderSingleTrip(trip) {
    console.log('RENDERING SINGLE TRIP');
    const $tripDetails = $('#single-trip-details');
    //Clears the list so when you re-render it doesn't print duplicates
    $tripDetails.empty();
    $tripDetails.append(singleTripTemplate(trip.attributes));
    console.log(trip.attributes);
  },
  failRenderTrip() {
    console.log('FAILED TO RENDER SINGLE TRIP INFO');
    $('#single-trip-table').append('ERROR: Trip details were not successfully loaded.');
  }
};

$(document).ready( () => {
  $('#all-trips-table').hide();
  $('#single-trip-details').hide();

  tripTemplate = _.template($('#trip-template').html());
  singleTripTemplate = _.template($('#single-trip-template').html());

  // EVENTS
  // To view All Trips
  $('#all-trips').on('click', function() {
    $('#all-trips-table').show();
    loadTrips();
  });

  // To view a single Trip
  $('#all-trips-table').on('click', '.trip', function() {
    $('#single-trip-details').show();
    let tripID = $(this).attr('data-id');
    getTripDetails(tripID);
  });

  // To Show Trip Reservation Form
  // $('#single-trip-details').on('click', '#reserve-trip-button', function() {
  //   $('#reservation-form').show();
  // });
});
