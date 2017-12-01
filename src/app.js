// Vendor Modules
// import $ from 'jquery';

// load jquery and foundation in the window scope
import 'script-loader!jquery'
import 'script-loader!foundation-sites'

import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// MODELS
import Trip from './app/models/trip';
import Reservation from './app/models/reservation';

// COLLECTION
import TripList from './app/collections/trip_list';

// INITITAL SET UP CHECK
console.log('it loaded!');

// GENERATE TRIPLIST COLLECTION
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

// loadTrips FUNCTION
const loadTrips = function loadTrips() {
  tripList.fetch();
  tripList.on('update', render, tripList);
};

// getTripDetails FUNCTION
let singleTripTemplate;

const getTripDetails = function getTripDetails(attrID) {
  console.log('View Trip Row clicked');

  const trip = new Trip({ id: attrID });
  trip.fetch({success: events.renderSingleTrip, error: events.failRenderTrip});

  console.log(trip)

  $('#reservation-form').hide();
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

// makeTripReservation FUNCTION
const makeTripReservation = function makeTripReservation(id) {
  const trip = tripList.findWhere({id: parseInt(id)});

  // Validations: Testing missing parameters
  // const reservation = trip.reserve({age: "21", email:"jedrzo@ada.com"});
  // reservation.on("invalid", function(model, error) {
  //   $('#myModal ul').append('<li>Something went wrong!</li>');
  //   $('#myModal').foundation('open');
  // });

  reservation.on("invalid", function(model, error) {
    // $('#myModal ul').append(`<li>Something went wrong! Please resolve: ${reservation.validationError['age'][0]}</li>`);
    $('#myModal ul').append(`<li>Something went wrong! Please resolve: ${JSON.stringify(error)}</li>`);
    $('#myModal').foundation('open');
  });
  reservation.save();
  console.log(reservation);

};

$(document).ready( () => {
  $(document).foundation();
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
    const tripID = $(this).attr('data-id');
    getTripDetails(tripID);
  });

  // To Show Trip Reservation Form
  $('#single-trip-template').on('click', '#reserve-trip-button', function() {
    $('#reservation-form').show();
  });

  // To Show New Trip Form Modal
  $('#single-trip-details').on('submit', '#reservation', function(e) {
    e.preventDefault();
    const tripID = $(this).attr('data-id');
    makeTripReservation(tripID);
  });

});
