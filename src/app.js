// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

import Trip from './app/models/trip'

import TripList from './app/collections/trip_list';

import Reservation from './app/models/reservation'



const TRIP_FIELDS = ['name', 'about', 'continent', 'category', 'weeks', 'cost'];
const RESERVATION_FIELDS = ['tripId', 'name', 'email', 'age'];

const trips = new TripList();

let tripTemplate;

let showTripTemplate;

// Clear status messages
const clearStatus = function clearStatus() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
};

// Add a new status message
const reportStatus = function reportStatus(status, message) {
  // console.log(`Reporting ${ status } status: ${ message }`);

  // TODO: use an underscore method for this
  // Should probably use an Underscore template here.

  const statusHTML = `<li class="${ status }">${ message }</li>`;

  // note the symetry with clearStatus()
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};


const render = function render(trips) {

  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  trips.forEach((trip) => {
    // console.log(trip)
    const generatedHTML = tripTemplate(trip.attributes);

    tripTableElement.append(generatedHTML);
    // console.log(trip.attributes.id);

    // $('#trip-list ').attr('trip-id').val(`${trip.attributes.id}`);
    // console.log(`${trip.attributes.id}`)
    // data-id=${trip.id}
  });
  $('#trips').show();

  // provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ trips.comparator }`).addClass('current-sort-field');
};

const showTrip = function showTrip(id) {
  // console.log(parseInt(id));
  const singleTrip = $('#show-trip');

  // singleTrip.html('');

  const trip = trips.findWhere({id: parseInt(id)});
  // console.log(trip.url);
  // let result = trip.fetch();
  trip.fetch({
    success: (model, response) => {
      console.log('Successfully found trip!');
      // reportStatus('success', 'Successfully saved trip!');
      console.log(response);

      const generatedHTML = showTripTemplate(response);
      // singleTrip.append(generatedHTML);
      singleTrip.html(generatedHTML);
      $('#reserve-trip-form').on('submit', function(ev) {
        ev.preventDefault();
        // ev.stopPropagation()
        alert( "Handler for .submit() called." );

        addReservationHandler();
      })
    },
  })
  $('#show-trip').show();


//   $( "#target" ).submit(function( event ) {
//   alert( "Handler for .submit() called." );
//   event.preventDefault();
// });
console.log(`this is the show trip click event`);
console.log(event);
  console.log(`this is the show trip id ${id}`);
// $( "#reserve-trip-form" ).submit(function( e ) {
//   e.preventDefault();
//
//   alert( "Handler for .submit() called." );
//     // addReservationHandler();
//
// });


  // addReservationHandler

  // console.log(result);
  // // trips.fetch(trip.url)
  // const generatedHTML = showTripTemplate(result.responseJSON);
  //
  //
  //
  //
  // singleTrip.append(generatedHTML);

  // $('#show-trip').html(id);
  // $('#show-trip').show();
};

const readFormData = function readFormData() {
  const tripData = {};

  TRIP_FIELDS.forEach((field) => {


    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();

    // Don't take empty strings, so that Backbone can
    // // fill in default values
    // if (value != '') {
    //   bookData[field] = value;
    // }


    tripData[field] = value;
    // TODO: see below
    // clears the field
    // break this out into a clear inputs and a method that reads inputs and one that does both
    // methods that don't have side effects
    // pure functions are guaranteed to be idempotent
    //TODO: check
    // inputElement.val('');
  });

  return tripData;
};

const handleValidationFailures = function handleValidationFailures(errors) {
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
};

const addReservationHandler = function(ev) {
  // ev.preventDefault();
  console.log('in addReservationHandler')
  const reservationData = {};

  RESERVATION_FIELDS.forEach((field) => {


    // const inputElement = $(`#add-reservation-form input[name="${ field }"]`);
    const inputElement = $(`#reserve-trip-form input[name="${ field }"]`);

    const value = inputElement.val();
    console.log(field);
    console.log(value);

    // console.log($(`#add-reservation-form input[name="tripId"]`).val());
    // Don't take empty strings, so that Backbone can
    // // fill in default values
    // if (value != '') {
    //   bookData[field] = value;
    // }


    reservationData[field] = value;
    // clears the field
    // break this out into a clear inputs and a method that reads inputs and one that does both
    // methods that don't have side effects
    // pure functions are guaranteed to be idempotent
    //TODO: check
    // inputElement.val('');
  });
  // $(`#reserve-trip-form input[name="tripId"]`).value
  // const TripIdResult = $(`#reserve-trip-form input[name="tripId"]`).value
  // console.log('trip id result');
  //
  // console.log(TripIdResult);
  // const tripId = $('#add-reservation-form').attr('data-id').val();
  // tripData['id'] = tripId;
  // console.log(tripId);
  // return tripData;
  console.log(reservationData)
  const reservation = new Reservation(reservationData);

  if (!reservation.isValid()) {
    handleValidationFailures(reservation.validationError);
    return;
  }
  console.log(reservation);

  // TODO: pull out into function so can DRY saving reservation and trip models
  reservation.save({}, {
    success: (model, response) => {
      console.log('Successfully saved reservation!');
      trips.add(model);
      // reportStatus('success', 'Successfully saved trip!');
    },
    error: (model, response) => {
      console.log('Failed to save reservation! Server response:');
      console.log(response);
      const errors = response.responseJSON["errors"];
      // print server-side validation failures if client-side validation
      // somehow misses a server-side validation
      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
}

const addTripHandler = function(event) {
  event.preventDefault();
  // const tripData = {};
  // console.log('in trip handler');
  //
  // TRIP_FIELDS.forEach((field) => {
  //
  //   const inputElement = $(`#add-trip-form input[name="${ field }"]`);
  //   const value = inputElement.val();
  //   tripData[field] = value;
  //   // clears the field
  //   inputElement.val('');
  // });


  console.log('read trip data');
  // console.log(readFormData());

  const trip = new Trip(readFormData());
  //const trip = trips.add(tripData);
  if (!trip.isValid()) {
    handleValidationFailures(trip.validationError);
    return;
  }
  console.log(trip);
  // console.log(trip.url)


  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      trips.add(model);
      // reportStatus('success', 'Successfully saved trip!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);
      const errors = response.responseJSON["errors"];
      // print server-side validation failures if client-side validation
      // somehow misses a server-side validation
      handleValidationFailures(response.responseJSON["errors"]);

    },
  });
};

$(document).ready( () => {

  tripTemplate = _.template($('#trip-template').html());
  showTripTemplate = _.template($('#show-trip-template').html());

  trips.on('update', render)
  trips.on('sort', render);

  trips.fetch();
  // console.log(trips);

  $('#add-trip-form').on('submit', addTripHandler);
  // TODO: FIX LOAD TRIPS BUTTON
  // $('#load-trips').on('click', render);

  $('#load-add-trip').on('click', () => $('#add-trip').toggle());

  $('#trip-list').on('click', 'tr td', function () {
    // event.preventDefault();
    // event.stopPropagation();
    let tripId = $(this).attr('data-id');
    console.log(`this is the trip id ${$(this).attr('data-id')}`);
    // render();
    showTrip(tripId);
  });

  // $('#reserve-trip-form').on('submit', function (event) {
  //   event.preventDefault();
  //   addReservationHandler
  // });

  //
  // $('#reserve-trip-form').on('submit', function () {
  //   let tripId = $(this).attr('data-id');
  //   console.log(`this is the trip id ${$(this).attr('data-id')}`);
  //   // render();
  //   showTrip(tripId);
  // });

  //   $('#trips table').on('click', 'tr .id', function () {
  //   let tripID = $(this).attr('data-id');
  //   console.log(`this is the trip id${$(this).attr('data-id')}`);
  //   loadTrip(tripID);
  // });


    TRIP_FIELDS.forEach((field) => {
      const headerElement = $(`th.sort.${ field }`)
      headerElement.on('click', (event) => {
        console.log(`Sorting table by ${ field }`);
        trips.comparator = field
        trips.sort();
      });
    });

    $('#status-messages button.clear').on('click', clearStatus);


});
