// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripsList from './app/collections/trips_list.js';
import Trip from './app/models/trip.js';

// variable declarations and functions
const TRIP_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];

const RES_FIELDS = ['name', 'age', 'email'];

let tripsTemplate;

let tripTemplate;

const tripsList = new TripsList();


// render all trips
const renderTrips = function renderTrips(list) {
  const tripTableElement = $('#trips-list');
  tripTableElement.html('');

  list.forEach((trip) => {
    const generatedHTML = tripsTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  })
};

// render individual trip
const renderTrip = function renderTrip(trip) {
  const tripElement = $('#trip-detail');

  const generatedHTML = tripTemplate(trip.attributes);
  tripElement.html(generatedHTML);
};

// add trip handler
const addTripHandler = function(event) {
  event.preventDefault();

  console.log('in the add trip handler');
  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();
    tripData[field] = value;

    inputElement.val('');
  });

  console.log("Read trip data");
  console.log(tripData);

  const trip = new Trip(tripData);

  trip.save({}, {
    success: (model, response) => {
      tripsList.add(model);
      reportStatus('success', 'Successfully add a trip!');
    },
    error: (model, response) => {
      console.log('Failed to save a trip! Server response:');
      console.log(response);

      const errors = response.responseJSON["errors"];
      for (let field in errors) {
        for (let problem of errors[field]) {
          reportStatus('error',`${field}: ${problem}`);
        }
      }
    },
  });
};


const addReservationHandler = function(event) {
  event.preventDefault();
  console.log('in the reservation handler');

  const reservationData = {};

  RES_FIELDS.forEach((field) => {
      const inputElement = $(`#makeReservation input[name="${ field }"]`);
      const value = inputElement.val();
      reservationData[field] = value;

      inputElement.val('');
  console.log('reading reservation data');
  console.log(reservationData);

// NOTE ///this will not work as it is currently written --- write a model?
  const reservation = new Reservation(reservationData);

  reservation.save({}, {
    success: (model, response) => {
      reportStatus('success', 'Successfully add a trip!');
    },
    error: (model, response) => {
      console.log('failed to save trip!');

      // NOTE // Need to handle errors that come in
    }
  })



  });
};

///NOTE //// Bug to fix
//
// app.js:66 Uncaught ReferenceError: reportStatus is not defined
//     at success (app.js:66)
//     at Object.options.success (backbone.js:638)
//     at fire (jquery.js:3317)
//     at Object.fireWith [as resolveWith] (jquery.js:3447)
//     at done (jquery.js:9272)
//     at XMLHttpRequest.<anonymous> (jquery.js:9514)

$(document).ready(() => {
  //underscore
  tripsTemplate = _.template($('#trips-list-template').html());
  tripTemplate = _.template($('#trip-template').html());

  //backbone
  tripsList.on('update', renderTrips);
  tripsList.fetch();

  // jquery
  $('#trips-list').on('click', '.trips', function(event) {
    const trip = new Trip({ id: $(this).data("id")});

    trip.on('change', renderTrip);
    trip.fetch();
  });


// add trip
  $('#add-trip-form').on('submit', addTripHandler);

//reserve a spot on a trip
  $('#makeReservation').on('submit', addReservationHandler);

});








// old code for adding a trip -- hard coded to see if it would work 


// user can create a new trip

// $('#add-trip-button').on('click', function(event) {
//   const biancasTrip = {
//     name: "Bianca's trip to Spain",
//     continent: "Europe",
//     about: "Enjoy tapas!",
//     category: "Culture",
//     weeks: 6,
//     cost: 2300
//   };
//
//   const trip = new Trip(biancasTrip);
//
//   trip.save({}, {
//     success: (model, response) => {
//       tripsList.add(model);
//     }
//   });
// });
