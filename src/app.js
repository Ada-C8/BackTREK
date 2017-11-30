// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

const tripList = new TripList();
let allTripsTemplate;
let tripHeadersTemplate;
let showTripTemplate;
let formTemplate;

const url = 'https://ada-backtrek-api.herokuapp.com/trips';
const tableFields = ['id', 'name', 'continent', 'category', 'weeks', 'cost'];
const addTripFields = ['name', 'continent', 'category', 'weeks', 'cost', 'about'];
const reservationFields = ['name', 'age', 'email'];

const fetchTrips = function fetchTrips() {
  tripList.fetch();
}

const loadTrips = function loadTrips() {
  $('.content').empty();
  tableFields.forEach((field) => {
    $('#trip-headers').append(tripHeadersTemplate({header: field}))
  });
  tripList.forEach((trip) => {
    $('#all-trips').append(allTripsTemplate(trip.attributes));
  });
};

const showTrip = function showTrip(event) {
  $('.content').empty();
  const tripId = event.currentTarget.id;
  const tripUrl = `${url}/${tripId}`;
  $.get(tripUrl, (response) => {
    if (response.weeks === 1) {
      response.plural = ''
    } else {
      response.plural = 's'
    }
    $('#show-trip').append(showTripTemplate(response));
  })
};

const clearMessages = function clearMessages() {
  $('#status-messages ul').empty();
  $('#status-messages').hide();
};

const addTripForm = function addTripForm() {
  $('.content').empty();
  addTripFields.forEach((item) => {
    $('#add-trip-form').append(formTemplate({field: item, lowercaseField: item}));
  });
  $('#add-trip-form').append('<section><button type="submit" class="button">Submit</button></section></form>');
}

const saveTrip = function saveTrip(event) {
  event.preventDefault();
  const tripData = {};
  addTripFields.forEach((field) => {
    tripData[field] = $(`#add-trip-form input[name=${field}]`).val();
  });
  const trip = new Trip(tripData);
  if (trip.isValid()) {
    trip.save({}, {
      success: successfulTripSave,
      error: failedSave,
    })
  } else {
    $('#status-messages ul').empty();
      for (let error in trip.validationError) {
        trip.validationError[error].forEach((message) => $('#status-messages ul').append(`<li>${message}</li>`));
      }
      $('#status-messages').show();
  }
}

const successfulTripSave = function successfulTripSave(trip) {
  tripList.add(trip);
  addTripFields.forEach((field) => {
    $(`#add-trip-form input[name=${field}]`).val('');
  });
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`);
  $('#status-messages').show();
}

const failedSave = function failedSave(model, response) {
  model.destroy
  $('#status-messages ul').empty();
  const errors = response.responseJSON.errors;
  for (let key in errors) {
    errors[key].forEach((issue) => {
      $('#status-messages ul').append(`<li>${key}: ${issue}</li>`);
    })
  }
  $('#status-messages').show();
}

const reserveForm = function reserveForm(event) {
  $('.content').empty();
  const tripId = $(event.currentTarget.attributes.tripid).val();
  $('#reserve-trip-form').attr('tripid', tripId);
  reservationFields.forEach((item) => {
    $('#reserve-trip-form').append(formTemplate({field: item, lowercaseField: item}));
  });
  $('#reserve-trip-form').append('<section><button type="submit" class="button">Submit</button></section></form>');
};

const saveReservation = function saveReservation(event) {
  event.preventDefault();
  const baseUrl = 'https://ada-backtrek-api.herokuapp.com/trips';
  const tripId = $(event.currentTarget.attributes.tripid).val();
  const finalUrl = `${baseUrl}/${tripId}/reservations`
  const reservationData = {};
  reservationFields.forEach((field) => {
    reservationData[field] = $(`#reserve-trip-form input[name=${field}]`).val();
  });
  const reservation = new Reservation(reservationData, {url: finalUrl});
  if (reservation.isValid()) {
    reservation.save({}, {
      success: successfulReservationSave,
      error: failedSave,
    })
  } else {
    $('#status-messages ul').empty();
      for (let error in reservation.validationError) {
        reservation.validationError[error].forEach((message) => $('#status-messages ul').append(`<li>${message}</li>`));
      }
      $('#status-messages').show();
  }
}

const successfulReservationSave = function successfulReservationSave(reservation, response) {
  reservationFields.forEach((field) => {
    $(`#reserve-trip-form input[name=${field}]`).val('');
  });
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`<li>A space reserved for ${reservation.get('name')}!</li>`);
  $('#status-messages').show();
  const fakeEvent = {currentTarget: {id: response.trip_id}};
  showTrip(fakeEvent);
}

$(document).ready( () => {
  allTripsTemplate = _.template($('#all-trips-template').html());
  tripHeadersTemplate = _.template($('#trip-headers-template').html());
  showTripTemplate = _.template($('#show-trip-template').html());
  formTemplate = _.template($('#form-template').html());
  $('#load-trips').on('click', fetchTrips);
  tripList.on('update', loadTrips);
  $('#all-trips').on('click', '.trip', showTrip);
  $('#add-trip').on('click', addTripForm);
  $('#add-trip-form').on('submit', saveTrip);
  $('#show-trip').on('click', '#reserve', reserveForm);
  $('#reserve-trip-form').on('submit', saveReservation);
  $('.clear, #load-trips, #add-trip').on('click', clearMessages);
});
