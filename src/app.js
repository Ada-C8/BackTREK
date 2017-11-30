// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

const tripList = new TripList();
// const trip = new Trip();

let tripListTemplate;
let tripTemplate;

// renders
const renderTripList = function renderTripList(tripList) {
  // empty existing list and res form
  const $tripList = $('#trip-list');
  $tripList.empty();
  $('#reservation').empty();

  tripList.forEach((trip) => {
    $tripList.append(tripListTemplate(trip.attributes));
  });
};

const renderTrip = function renderTrip(trip) {
  const $tripDetail = $('#trip-detail');

  $tripDetail.empty();
  $tripDetail.append(tripTemplate(trip.attributes))
  $('.reservation').append(loadResForm(trip.id));
};

const cancelSubmit = function cancelSubmit() {
  $(this).parent().trigger('reset');
  $('.error-messages').empty();
};

const readForm = function readForm(form) {
  const fields = form.find(':input').not('button');
  const formData = {};

  for (let i = 0; i < fields.length; i += 1) {
    const field = fields[i];
    formData[field.name] = $(`#${field.id}`).val();
  }

  console.log(formData);
  return formData;
};

const readTripForm = function readTripForm() {
  const $tripForm = $('#add-trip-form');
  return readForm($tripForm);
};

const readResForm = function readResForm(tripId) {
  const $resForm = $('#add-res-form');
  const resData = readForm($resForm);
  resData['trip_id'] = tripId;

  console.log(resData);
  return resData
}

const getTrip = function getTrip(event) {
  const tripId = event.currentTarget.id;
  let trip = new Trip({id: tripId});

  trip.fetch({
    success: function(trip, response, options) {

      // render error if no content
      if (options.xhr.status === 204) {
        const html = '<h3>Trip Not Found</h3>';
        $('.detail.status-messages').append(html);
      } else {
        renderTrip(trip);
      }
    },
    // how is this handled???
    error: function(trip) {
      console.log(trip);
    }
  });
};

const successfulSave = function successfulSave(trip) {
  $('.error-messages').empty();

  tripList.add(trip);
  $.modal.close();
};

const failedSave = function failedSave(trip, response) {
  const $errors = $('.error-messages');

  $errors.empty();
  $errors.append('<h4>Failed to save<h4><ul>');

  const errorList = response.responseJSON.errors;

  Object.keys(errorList).forEach((errorType) => {
    errorList[errorType].forEach((error) => {
      $errors.append(`<li>${errorType}: ${error}</li>`);
    });
  });
  $errors.append('</ul>');
};

const addTrip = function addTrip(event) {
  event.preventDefault();
  const trip = new Trip(readTripForm());

  // client side validations
  if (trip.isValid()) {
    trip.save({}, {
      success: successfulSave,
      error: failedSave
    });
  } else {
    console.log(trip.validationError);
  }
};

const loadResForm = function loadTripForm(tripId) {
  const html = `
  <form id="add-res-form" data-id="${tripId}" action="https://ada-backtrek-api.herokuapp.com/trips/${tripId}/reservations" method="post">
    <label>Name</label>
    <input type="text" id="res-name" name="name" />

    <label>Age</label>
    <input type="number" id="age" name="age" />

    <label>Email</label>
    <input type="email" id="email" name="email" />

    <button class="button confirm" type="submit" id="add-reservation">Reserve this Trip</button>
    <button class="button cancel" type="reset" id="cancel-reservation">Cancel</button>
  </form>`;

  $('.reservation').append(html);
};

const addRes = function addRes(event) {
  event.preventDefault();

  const tripId = $('#add-reservation').parent().data('id');
  console.log(tripId);

  console.log('adding res');
  const res = new Reservation(readResForm(tripId));

  // client-side validations
  if (res.isValid()) {
    res.save({
      success: successfulSave,
      error: failedSave
    });
  }
  else {

  }
};



$(document).ready( () => {
  // load templates
  tripListTemplate = _.template($('#trip-list-template').html());
  tripTemplate = _.template($('#trip-template').html());

  tripList.on('update', renderTripList, tripList);
  $('#trip-list').on('click focus', 'tr', getTrip, this);


  $('.cancel').on('click', cancelSubmit);
  $('#add-trip').on('submit', addTrip);

  // $('#trip-detail').on('click', '#add-trip-form', func($(this)));

  $('#trip-detail').on('submit', '#add-res-form', addRes);

  tripList.fetch();
});
