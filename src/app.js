// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from 'app/models/trip.js'
import Reservation from 'app/models/reservation.js'
import TripList from 'app/collections/tripList.js'

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

const tripList = new TripList();

const TRIP_FIELDS = [ 'id', 'name', 'continent', 'category', 'weeks','cost', 'about']

const RESERVATION_FIELDS = [ 'tripID', 'name', 'age', 'email']

const render = function render(tripList) {
  console.log(tripList);
  tripList.forEach((trip) => {
    let currentTrip = new Trip({id: trip.id});
    currentTrip.fetch().done(function() {
      console.log(currentTrip.attributes);
      const tripTemplate =  _.template($('#trip-template').html());
      const tripHTML = tripTemplate(currentTrip.attributes);

      $('#trip-list').append(tripHTML);
      let id = currentTrip.get('id')
      console.log(`.current-trip-${id}`);
      // $('#submit-reservation').on('submit', addReservationHandler);
    });
  });
};

const tripDetailHandler = function (event){
  console.log(event.target.parentElement.id);
  let id = event.target.parentElement.id;
  $(`.details-${id}`).toggleClass('hide');
  $(`.button-${id}`).toggleClass('hide');
}

const reserveFormUpdate = function (event){
  console.log(event.target.parentElement.className);
  let id = event.target.parentElement.className

  let currentTrip = new Trip({id: id});
  currentTrip.fetch().done(function() {
    const formTemplate =  _.template($('#form-template').html());
    console.log(formTemplate);
    const formHTML = formTemplate(currentTrip.attributes);
    // $('.form-container').removeClass('hide');
    $('#form-container').html(formHTML);
    $('#reserve-form').on('click','.submit-reservation', addReservationHandler);
  });
}

const addTripHandler = function(event){
  event.preventDefault();
  const trip = new Trip(readTripFormData());

  if (!trip.isValid()) {
    handleValidationFailures(trip.validationError);
    return;
  }
  console.log('I am getting ready to make a trip!')
  console.log(trip.attributes)
  tripList.add(trip);
  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      reportStatus('success', 'Successfully saved book!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);
      tripList.remove(model);

      handleValidationFailures(response.responseJSON["errors"]
    );
  },
});
};


const addReservationHandler = function addReservationHandler(event) {
  event.preventDefault();
  console.log('this is the reserve function')

  const reservation = new Reservation(readReservationFormData());

  // if (!reservation.isValid()) {
  //   handleValidationFailures(reservation.validationError);
  //   return;
  // }
}

const handleValidationFailures = function handleValidationFailures(errors) {
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
};

// Add a new status message
const reportStatus = function reportStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);
  // Should probably use an Underscore template here.
  const statusHTML = ` <p class="${ status }">${ message }</p>`;
  // note the symetry with clearStatus()
  $('.status-messages').append(statusHTML);
  $('.status-messages').show();
};


const readTripFormData = function readTripFormData() {
  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();

    if (value != '') {
      tripData[field] = value;
    }
    inputElement.val('');
  });
  console.log("Read trip data");
  console.log(tripData.attributes);
  return tripData;
};

const readReservationFormData = function readReservationFormData() {
  console.log('getting ready to read reservation form')
  const reservationData = {};
  RESERVATION_FIELDS.forEach((field) => {
    // select the input corresponding to the field we want
    const inputElement = $(`#reserve-form input[name="${ field }"]`);
    const value = inputElement.val();

    if (value != '') {
      reservationData[field] = value;
    }
    inputElement.val('');
  });
  console.log("Read reservation data");
  console.log(reservationData.attributes);
  return reservationData;
};


$(document).ready( () => {
  tripList.fetch().done(function() {
    console.log('done');
    render(tripList);
    let currentTrip = new Trip();
  });

  $('#trip-list').on('click', 'button', tripDetailHandler);

  $('#trip-list').on('click', '.reserve', reserveFormUpdate);
  // $('.new-trip-button').on('click', addReservationHandler);
  // $('#reserve-form').on('submit', addReservationHandler);
  $('#add-trip-form').on('submit', addTripHandler);
});
