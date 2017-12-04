// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list';
import Trip from './app/models/trip';
import Reservation from './app/models/reservation'

const tripList = new TripList();
let tripTemplate;
let tripDetails;
let registrationTemplate;
let reportStatusTemplate;

const tripFields = ['name', 'continent', 'category', 'cost', 'weeks', 'about'];
const reservationFields = ['name', 'email', 'age']

const render = function render(event) {
  const tableElement = $('#trip-list');
  tableElement.html('');

  tripList.forEach((trip) => {
    if (!trip.get('id')) {
      console.log('this is a bad trip');
      console.log(trip);
    } else {
      const generatedHTML = tripTemplate(trip.attributes);
      tableElement.append(generatedHTML);
    }
  });

  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');

};

const showTrips = function showTrips(event) {
  $('#trips-table').show();
  $('.centerbutton').hide();
};

const showTripDetails = function showTripDetails(event) {
  const trip = tripList.get($(this).attr('data-id'))

  trip.fetch({
    success: (model, response) =>{
      // console.log('trip fetch success');
      const generatedHTML = tripDetails(trip.attributes);
      $('#trip-details').html(generatedHTML)
    },
    failure: (model, response) => {
      console.log('trip fetch failure');
      reportStatus('success', 'Trip temporarilty unavailable');
    }
  });
};

const loadRegistrationForm = function loadRegistrationForm(event) {
  const tripId = {tripId: $(this).attr('data-id')}
  const generatedHTML = registrationTemplate(tripId);
  // i keep passing this id through into various html attributes - is this the best way of accessing it?
  $('.sign-up').hide();
  $('#trip-details').append(generatedHTML);
};

const loadModal = function loadModal(event) {
  $('#add-trip').show();
};

const makeObject = function makeObject(fields, formId) {
  const objectData = {};
  fields.forEach((field) => {
    const inputElement = $(`${formId} input[name="${ field }"]`);
    const value = inputElement.val();
    objectData[field] = value;

    inputElement.val('');
  });
  return objectData
};

const addReservationHandler = function addReservationHandler(event) {
  event.preventDefault();

  const reservation = new Reservation(makeObject(reservationFields, '#res-form'));
  reservation.tripId =$(this).attr('data-id')

  // if (!reservation.isValid()) {
  //   handleValidationFailures(reservation.validationError);
  //   return;
  // }

  reservation.save({}, {
    success: (model, response) => {
      reportStatus('success', 'Successfully reserved spot on trip')
    },
    error: (model, response) => {
      handleValidationFailures(response.responseJSON['errors']);
    }
  });
};

const addTripHandler = function addTripHandler(event) {
  event.preventDefault();

  const trip = new Trip(makeObject(tripFields, '#add-trip-form'));

  if (!trip.isValid()) {
    handleValidationFailures(trip.validationError);
    return;
  }

  tripList.add(trip);

  trip.save({}, {
    success: (model, response) => {
      reportStatus('success', 'Successfully saved book!');
      $('#add-trip').hide();

    },
    error: (model, response) => {
      tripList.remove(model)
      handleValidationFailures(response.responseJSON["errors"]);
    },
  });

};

const reportStatus = function reportStatus(status, message) {
  // console.log(`Reporting ${ status } status: ${ message }`);
  const statusHTML = reportStatusTemplate({status: status, message: message});

  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};


const handleValidationFailures = function handleValidationFailures(errors) {

  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
};

const clearStatus = function clearStatus() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
};

$(document).ready( () => {

  $('#trips-table').hide();
  $('#add-trip').hide();

  tripDetails = _.template($('#trip-info').html());
  tripTemplate = _.template($('#trip-template').html());
  registrationTemplate = _.template($('#registration-form').html());
  reportStatusTemplate = _.template($('#status-report').html());


  $('#load').on('click', showTrips);

  tripList.on('update', render)
  tripList.on('sort', render);

  tripList.fetch();

  $('#trips-table').on('click', '.trip-name', showTripDetails);

  $('#trip-details').on('click', '.sign-up', loadRegistrationForm)

  $('#trip-details').on('submit', '#res-form', addReservationHandler );

  $('#add-trip-form').on('submit', addTripHandler);

  $('#add-trip-button').on('click', loadModal);

  $('#status-messages button.clear').on('click', clearStatus);

  tripFields.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`Sorting table by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });
});
