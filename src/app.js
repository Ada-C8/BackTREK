// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip'
import TripList from './app/collections/trip_list'
import Reservation from './app/models/reservation'

let tripTemplate;
let individualTripTemplate;
// let reportStatusTemplate;

const tripList = new TripList();

//clearStatus messages
const clearStatus = function clearStatus() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
};

//clearAddTripForm
const clearAddTripForm = function clearAddTripForm() {
  $('#trip-form-message').hide();
}

// render html for tripList
const render = function render(tripList) {
  //iterate through the tripList, generate HTML
  //for each model and attach it to the DOM
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  //will clear out previous list when you render again

  // TODO: inline event handler so we get a closure for trip
  // tripList.forEach((trip) => {
  // const genhtml = $(tripTemplate(trip.attributes));
  // genhtml.on('click', (event) => {
  // renderDetails(trip);
  // });
  // tripTable.append(genhtml);

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    console.log(`In tripList forEach, trip.attributes: ${trip.attributes}`);
    tripTableElement.append(generatedHTML);
  })
  $('#trip-table').show();


  // TODO: REFACTOR
  $('.trip').on('click', function(event) {
    // event.preventDefault();
    console.log('in the trip click');

    // get the id of the trip you clicked on
    let tripId = $(this).attr('data-id');
    // fetch the trip details of the trip you clicked on from the api; fetch returns a hash
    let trip = tripList.get(tripId)
      trip.fetch({
        success: function(model) {
          console.log(`in the fetch and about is: ${model.get('about')}`);
          console.log(`model attributes: ${model.get('attributes')}`);

          const individualtripListElement = $('#individual-trip-details');

          individualtripListElement.html(''); //will clear out previous list when you render again

          const generatedHTMLTripDetails = individualTripTemplate(model.attributes);
          individualtripListElement.append(generatedHTMLTripDetails);

          $('#individual-trip-details').show();

          // Listen for submit event on #reserve-trip
          $('#reserve-trip').on('submit', addReservationHandler);

        } // function
      }); // fetch
  })
}; //render

const RESERVATION_FIELDS = ['name', 'email', 'tripId'];

const readReservationFormData = function readReservationFormData() {
  const reservationData = {};
  RESERVATION_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#reserve-trip input[name="${ field }"]`);
    const value = inputElement.val();

    reservationData[field] = value;

    //TODO: ERROR HANDLING
    // Don't take empty strings, so that Backbone can
    // fill in default values
    // if (value != '') {
    //   tripData[field] = value;
    // }
    //
    // inputElement.val('');
  });

  console.log("Read reservation data");
  console.log(reservationData);

  return reservationData;
};


const addReservationHandler = function(event) {
  event.preventDefault();

  const reservation = new Reservation(readReservationFormData());

  //TODO: ERROR HANDLING
  // if (!reservation.isValid()) {
  //   console.log('Client side error handling');
  //   handleValidationFailures(reservation.validationError);
  //   return;
  // }

  reservation.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      // tripList.add(trip);
      $('#individual-trip-details').hide();
      reportStatus('success', 'Successfully made reservation!');
      //add to collection?
    },
    error: (model, response) => {
      console.log('Failed to make reservation! Server response:');
      console.log(response);

      // Server-side validations failed, so remove this bad
      // trip from the list
      // tripList.remove(model);

      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};


const TRIP_FIELDS = ['name', 'about', 'continent', 'category', 'weeks', 'cost'];

const readFormData = function readFormData() {
  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();

    tripData[field] = value;

    //TODO: ERROR HANDLING
    // Don't take empty strings, so that Backbone can
    // fill in default values
    // if (value != '') {
    //   tripData[field] = value;
    // }
    //
    // inputElement.val('');
  });

  console.log("Read trip data");
  console.log(tripData);

  return tripData;
};

//TODO: ERROR HANDLING
const handleValidationFailures = function handleValidationFailures(errors) {
  console.log('In handleValidationFailures()');
  // Since these errors come from a Rails server, the strucutre of our
  // error handling looks very similar to what we did in Rails.
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
};

// Add a new status message
const reportStatus = function reportStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);

  // const statusHTML = reportStatusTemplate(trip.attributes);

  const statusHTML = `<li class="${ status }">${ message }</li>`;

  // note the symetry with clearStatus()
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};

const addTripHandler = function(event) {
  event.preventDefault();

  const trip = new Trip(readFormData());

  //TODO: ERROR HANDLING
  if (!trip.isValid()) {
    console.log('Client side error handling');
    handleValidationFailures(trip.validationError);
    return;
  }

  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      tripList.add(trip);
      $('#trip-form-message').hide();
      reportStatus('success', 'Successfully saved trip!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);

      // Server-side validations failed, so remove this bad
      // trip from the list
      // tripList.remove(model);

      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};


$(document).ready( () => {
  // compile templates for all trips and individual trips
  tripTemplate = _.template($('#trip-template').html());

  individualTripTemplate = _.template($('#individual-trip-template').html());

  // reportStatusTemplate = _.template($('#report-status-template').html());

  // Register update listener first, to avoid the race condition
  tripList.on('update', render);

  // Listen for user click on add trip button
  $('#add-trip').on('click', function() {
    console.log('#add-trip clicked');
    // Make form available to user
    // $('#add-trip-form').show();
    $('#trip-form-message').show();
  });

  // Listen for when user submits trip form
  $('#add-trip-form').on('submit', addTripHandler);
  // });

  // Listen for click event on #all-trip
  $('#all-trips').on('click', function() {
    console.log('#all-trip has been clicked, in event handler');
    // When fetch gets back from the API call, it will add trips
    // to the list and then trigger an 'update' event
    tripList.fetch();
    console.log('#all-trip has been clicked, in event handler, after fetch()');
  });


  $('#status-messages button.clear').on('click', clearStatus);

  $('#trip-form-button').on('click', clearAddTripForm);
});
