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
let reportStatusTemplate;

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

const CONDENSED_TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

const TRIP_FIELDS = ['name', 'about', 'continent', 'category', 'weeks', 'cost'];

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

const handleValidationFailures = function handleValidationFailures(errors) {
  console.log('In handleValidationFailures()');

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

  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};

////////////////eventHandlers////////////////////

const addIndividualTripHandler = function addIndividualTripHandler(event) {
  console.log('in the trip click');
  $('html,body').scrollTop(0);

  let tripId = $(this).attr('data-id');
  let trip = tripList.get(tripId)
    trip.fetch({
      success: function(model) {
        const individualtripListElement = $('#individual-trip-details');

        individualtripListElement.html('');

        const generatedHTMLTripDetails = individualTripTemplate(model.attributes);
        individualtripListElement.append(generatedHTMLTripDetails);

        $('#individual-trip-details').show();

        // Listen for submit event on #reserve-trip
        $('#reserve-trip').on('submit', addReservationHandler);
      }//success function
    });//fetch
  };//addIndividualTripHandler function

const addTripHandler = function(event) {
  event.preventDefault();
  const trip = new Trip(readFormData());

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
      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};

const addReservationHandler = function(event) {
  event.preventDefault();

  const reservation = new Reservation(readReservationFormData());

  if (!reservation.isValid()) {
    console.log('Client side error handling');
    handleValidationFailures(reservation.validationError);
    return;
  }

  reservation.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      $('#individual-trip-details').hide();
      reportStatus('success', 'Successfully made reservation!');
    },
    error: (model, response) => {
      console.log('Failed to make reservation! Server response:');
      console.log(response);

      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};

///////////render HTML for tripList//////////////
const render = function render(tripList) {

  const tripTableElement = $('#trip-list');
  tripTableElement.html('');

  // TODO: inline event handler so we get a closure for trips
  // tripList.forEach((trip) => {
  // const genhtml = $(tripTemplate(trip.attributes));
  // genhtml.on('click', (event) => {
  // renderDetails(trip);
  // });
  // tripTable.append(genhtml);

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTableElement.append(generatedHTML);
  })

  $('#trip-table').show();
  $('#filter-triplist').show();

  //Visual feedback code for sorting
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${tripList.comparator}`).addClass('current-sort-field');

  //Listen for click event on .trip
  $('.trip').on('click', addIndividualTripHandler);
};


///////////////////document.ready////////////////

$(document).ready( () => {
  // compile templates for all trips and individual trips
  tripTemplate = _.template($('#trip-template').html());

  individualTripTemplate = _.template($('#individual-trip-template').html());

  reportStatusTemplate = _.template($('#report-status-template').html());

  // Register update listener first, to avoid the race condition
  tripList.on('update', render);

  //Listen for sort event when user clicks on column
  tripList.on('sort', render);

  // Listen for user click on add trip button
  $('#add-trip').on('click', function() {
    console.log('#add-trip clicked');
    $('#trip-form-message').show();
  });

  // Listen for when user submits trip form
  $('#add-trip-form').on('submit', addTripHandler);

  // Listen for click event on #all-trip
  $('#all-trips').on('click', function() {
    console.log('#all-trip has been clicked, in event handler');
    tripList.fetch();
    console.log('#all-trip has been clicked, in event handler, after fetch()');
  });

  $('#status-messages button.clear').on('click', clearStatus);

  $('#trip-form-button').on('click', clearAddTripForm);

  // Build event handlers for each of the table headers
  CONDENSED_TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`.sort.${ field }`);
    headerElement.on('click', () => {
      console.log(`Sorting by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

  // Listen for search typing
  $('#typing-search').keyup(function (event) {
    console.log(`In typing-search, this: ${this}`);
    console.log(`In #typing-search, event: ${$(this).val()}`);

    const letters = $(this).val();
    // console.log(`Sibling of this: ${$('#typing-search').siblings('.select-header').val()}`);
    console.log(`Selected 1: ${$('#select-header').find(":selected").text()}`);
    // console.log(`Selected 2: ${$('#select-header option:selected').val()}`);
    // console.log(`Selected 3: ${$('#select-header').val()}`);
    const selectedHeader = $('#select-header').find(":selected").text();

    tripList.filterSearch(letters, selectedHeader);
  });
});
