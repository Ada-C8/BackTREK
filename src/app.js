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

const TABLE_HEADERS = [ 'name', 'continent', 'category', 'weeks','cost']

const RESERVATION_FIELDS = [ 'tripID', 'name', 'age', 'email']

const render = function render(tripList) {
  $('#trip-list').html('')
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
  $('.trip-status-messages').html('<p> </p>')
  const trip = new Trip(readTripFormData());

  if (!trip.isValid()) {
    handleValidationFailuresTrip(trip.validationError);
    return;
  }
  console.log('I am getting ready to make a trip!')
  console.log(trip.attributes)
  tripList.add(trip);
  trip.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      reportNewTripStatus('success', 'Successfully saved book!');
    },
    error: (model, response) => {
      console.log('Failed to save trip! Server response:');
      console.log(response);
      tripList.remove(model);

      handleValidationFailuresReservations(response.responseJSON["errors"]);
    },
  });
};


const addReservationHandler = function addReservationHandler(event) {
  event.preventDefault();
  $('.reservation-status-messages').html('<p> </p>')
  const reservation = new Reservation(readReservationFormData());

  if (!reservation.isValid()) {
    handleValidationFailuresReservation(reservation.validationError);
    return;
  }
  console.log('I am getting ready to reserve a trip!')
  console.log(reservation.attributes)

  // trip.add(trip);
  reservation.save({}, {
    success: (model, response) => {
      console.log('Successfully saved trip!');
      reportNewReservationStatus('success', 'Successfully saved reservation!');
      $('#reserve-form').addClass('hide')
      $
    },
    error: (model, response) => {
      console.log('Failed to save reservation! Server response:');
      console.log(response);
      // tripList.remove(model); <--what should I do here?

      handleValidationFailuresReservation(response.responseJSON["errors"]);
    },
  });
};

//Having two nearly identical funtions to handle errors is a poor
//solution to the problem of errors being appended to the wrong
// form. It would be better to find a way to pass some parameter
// into these functions to tell it where to place the errors.
const handleValidationFailuresTrip = function handleValidationFailures(errors) {
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportNewTripStatus('error', `${field}: ${problem}`);
    }
  }
};

const handleValidationFailuresReservation = function handleValidationFailures(errors) {
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportNewReservationStatus('error', `${field}: ${problem}`);
    }
  }
};

// Similarly to the ValidationFailures... this is not a good way
// to solve the problem.
const reportNewTripStatus = function reportNewTripStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);
  // Should probably use an Underscore template here.
  const statusHTML = ` <p class="${ status }">${ message }</p>`;
  // note the symetry with clearStatus()
  $('.trip-status-messages').append(statusHTML);
  $('.trip-status-messages').show();
};

const reportNewReservationStatus = function reportNewReservationStatus(status, message) {
  console.log(`Reporting ${ status } status: ${ message }`);
  // Should probably use an Underscore template here.
  const statusHTML = ` <p class="${ status }">${ message }</p>`;
  // note the symetry with clearStatus()
  $('.reservation-status-messages').append(statusHTML);
  $('.reservation-status-messages').show();
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
    // inputElement.val('');
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

 tripList.on('sort', render);


  $('#trip-list').on('click', 'button', tripDetailHandler);

  $('#trip-list').on('click', '.reserve', reserveFormUpdate);
  // $('.new-trip-button').on('click', addReservationHandler);
  // $('#reserve-form').on('submit', addReservationHandler);
  $('#add-trip-form').on('submit', addTripHandler);

  TABLE_HEADERS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`Sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

});
