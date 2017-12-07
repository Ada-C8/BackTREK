// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Our components
import Trip from './app/models/trip';
import Reservation from './app/models/reservation';
import TripList from './app/collections/trip_list';
console.log('it loaded!');

const tripList = new TripList()


const TRIP_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
const RESERVATION_FIELDS = ['name', 'email', 'age'];

let tripsTemplate;
let tripTemplate;

// Clear status messages
const clearStatus = function clearStatus() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
};

// Add a new status message
const reportStatus = function reportStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);

  const statusHTML = `<li class="${ status }">${ message }</li>`;

  // note the symetry with clearStatus()
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};

const render = function render(tripList){
  const $tripsTableElement = $('#trip-list');
  $tripsTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripsTemplate(trip.attributes));
    generatedHTML.on('click',(event) => {
      $('#trips').hide();
      $('#trip').show();
      trip.fetch({
        success (model, response){
          renderTrip(model);
        }
      });
    }) //.on
    $tripsTableElement.append(generatedHTML);
  }); //tripList
};  // render


const renderTrip = function renderTrip(trip){
  const $tripTableElement = $('#trip');
  $tripTableElement.html('');
  console.log(trip.attributes);

  const generatedHTML = tripTemplate(trip.attributes);
  $tripTableElement.html(generatedHTML);

  $('#reservation-form').on('submit', addReservHandler);

  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

const loadTrips = function loadTrips() {
  tripList.fetch({
    success(model, response) {
    render(model);
    }
  });
};

const readTripFormData = function readTripFormData() {
  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    const $inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = $inputElement.val();

    // Don't take empty strings, so that Backbone can
    // fill in default values
    if (value != '') {
      tripData[field] = value;
    }

    $inputElement.val('');
  });

  console.log(tripData);
  return tripData;
};

// Reserving a trip
const readReservFormData = function readReservFormData() {
  const reservData = {};
  RESERVATION_FIELDS.forEach((field) => {
    const $inputReservElement = $(`#reservation-form input[name="${ field }"]`);
    const value = $inputReservElement.val();

    if (value != '') {
      reservData[field] = value;
    }

    $inputReservElement.val('');
  });

  console.log("Read reserve data");
  console.log(reservData);
  return reservData;
};

const handleValidationFailures = function handleValidationFailures(errors) {
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
};

// Add trip
const addTripHandler = function(event) {
  event.preventDefault();
  // $('#status-messages').html('')

  const trip = new Trip(readTripFormData());
  console.log(trip);


  if (!trip.isValid()) {
    handleValidationFailures(trip.validationError);
    return;
  }

  trip.save({}, {
    success: (model, response) => {
      tripList.add(model);
      console.log('Yay, trip was saved successfully!');
      reportStatus('success', 'Yay, trip was saved successfully!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);

      // After server-side validations failed, we have to remove this bad
      // trip from the list
      tripList.remove(model);

      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};

// Add Reservation
const addReservHandler = function addReservHandler(event) {
  event.preventDefault();
  const reserve = new Reservation(readReservFormData());
  reserve.set('trip_id', $(this).data('tripId'));


  if (!reserve.isValid()) {
    handleValidationFailures(reserve.validationError);
    return;
  }

  reserve.save({}, {
    success: (model, response) => {
      console.log('Congratulations, you successfully reserved a trip!');

      reportStatus('success', 'Congratulations, you successfully reserved a trip!');
    },
    error: (model, response) => {
      console.log('Failed to save reservation. Server response: ');
      console.log(response);

      handleValidationFailures(response.responseJSON["errors"]);
    }
  })
}

$(document).ready(() => {
  tripsTemplate = _.template($('#trips-template').html());
  tripTemplate = _.template($('#trip-template').html());

  // $('#trips').hide();

  // Retrieving all trips by clicking the button
  $('#load').on('click', function(){
    $('#trips').show();
    loadTrips()
    $('#show_form').hide();
  });

  $('header').on('click', '#add_trip', function() {
    $('#status-messages').hide();
    $('#show_form').show();

  });

  $('#add-trip-form').on('submit', addTripHandler);

  $('#status-messages button.clear').on('click', (event) => {
    $('#status-messages ul').html('');
    $('#status-messages').hide();
    $('#show-form').hide();
  })
  // sorting by header element
  tripList.on('sort', render);
  TRIP_FIELDS.forEach((field) => {
    const headerData = $(`th.sort.${ field }`);
    headerData.on('click', (event) => {
      tripList.comparator = field;
      tripList.sort();
    });
  });
  $('#status-messages button.clear').on('click', clearStatus);
});
