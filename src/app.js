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
  },
  succesReservation(reservation, response) {
    console.log('RESERVATION SUCCESSFULLY SUBMITTED')
    console.log(reservation);

    $('#reservation-form .user-input').val('');
    $('#ReservationStatusModal ul').empty();
    $('#ReservationStatusModal p').empty();
    $('#ReservationStatusModal p').append('Your trip is now reserved!');
    $('#ReservationStatusModal').foundation('open');
  },
  failReservation() {
    console.log('RESERVATION SUBMISSION FAILURE')
    console.log(reservation);
    $('#ReservationStatusModal ul').empty();
    $('#ReservationStatusModal p').empty();
    $('#ReservationStatusModal p').append('Sorry, your request could not be completed.');
    $('#ReservationStatusModal').foundation('open');
  },
};

// makeTripReservation FUNCTION
const makeTripReservation = function makeTripReservation(id) {
  const trip = tripList.findWhere({id: parseInt(id)});

  const fields = ['name', 'age', 'email'];

  const reservationData = {};
  fields.forEach( (field) => {
    const val = $(`#reservation input[name=${field}]`).val();
    if (val != '') {
    reservationData[field] = val;
    }
  });

  const reservation = trip.reserve(reservationData);
  // Validations: Testing missing parameters
  //const reservation = trip.reserve({age: "21", email:"jedrzo@ada.com"});
  // Validations Test with simple error message:
  // reservation.on("invalid", function(model, error) {
  //   $('#ReservationStatusModal ul').append('<li>Something went wrong!</li>');
  //   $('#ReservationStatusModal').foundation('open');
  // });
  //reservation.save();

  reservation.on("invalid", function(model, errors) {
    console.log('INSIDE .ONinvalidevent');
    $('#ReservationStatusModal h2').empty();
    $('#ReservationStatusModal h2').append('Reservation Status');
    $('#ReservationStatusModal p').empty();
    $('#ReservationStatusModal p').append('Sorry, your request could not be completed. Please resolve the following:');
    $('#ReservationStatusModal ul').empty();
    for (let key in errors) {
      $('#ReservationStatusModal ul').append(`<li>${key.charAt(0).toUpperCase() + key.slice(1)}: ${errors[key]}</li>`);
      $('#ReservationStatusModal').foundation('open');
    };
  });

  reservation.save({}, {
    success: events.succesReservation,
    error: events.failReservation,
  });
};

//addNewTrip FUNCTION
const addNewTrip = function addNewTrip(details) {
  console.log('ADD TRIP BUTTON CLICKED')

  const fields = ['name', 'continent','category', 'weeks', 'cost'];

  const tripData = {};

  fields.forEach( (field) => {
    const val = $(`#new-trip-form input[name=${field}]`).val();
    if (val != '') {
    tripData[field] = val;
    }
  });

  const trip = new Trip(tripData);
  console.log('THIS IS A NEW TRIP');
  console.log(trip);

  trip.on("invalid", function(model, errors) {
    console.log('INSIDE TRIP VALIDATION');
    $('#ReservationStatusModal h2').empty();
    $('#ReservationStatusModal h2').append('New Trip Submission Status');
    $('#ReservationStatusModal p').empty();
    $('#newTripModalStatus p').append('Sorry, your request could not be completed. Please resolve the following:');
    $('#ReservationStatusModal ul').empty();
    for (let key in errors) {
      $('#ReservationStatusModal ul').append(`<li>${key.charAt(0).toUpperCase() + key.slice(1)}: ${errors[key]}</li>`);
      $('#ReservationStatusModal').foundation('open');
    };
  });
  console.log('IS THIS TRIP INVALID?');
  trip.isValid();
  // trip.save({}, {
  //   success: events.successTripSave,
  //   error: events.failTripSave,
  // });

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

  // // To Show Trip Reservation Form
  // $('#single-trip-template').on('click', '#reserve-trip-button', function() {
  //   $('#reservation-form').show();
  // });

  // To Show New Trip Form Modal
  $('#single-trip-details').on('submit', '#reservation', function(e) {
    e.preventDefault();
    const tripID = $(this).attr('data-id');
    makeTripReservation(tripID);
  });

  // To Add a New TRIP
  $('#new-trip-form').on('submit', function(e) {
    e.preventDefault();
    addNewTrip();
  });



});
