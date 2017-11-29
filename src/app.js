// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const tripList = new TripList();
// const trip = new Trip();

let tripListTemplate;
let tripTemplate;

// renders
const renderTripList = function renderTripList(tripList) {
  // empty existing list
  const $tripList = $('#trip-list');
  $tripList.empty();

  tripList.forEach((trip) => {
    $tripList.append(tripListTemplate(trip.attributes));
  });
  console.log(tripList);
};

const renderTrip = function renderTrip(trip) {
  const $tripDetail = $('#trip-detail');

  $tripDetail.empty();
  $tripDetail.append(tripTemplate(trip.attributes));
};

const cancelSubmit = function cancelSubmit() {
  $(this).parent().trigger('reset');
  $('.error-messages').empty();
};

const readTripForm = function readTripForm() {
  const tripFields = ['name', 'category', 'continent', 'weeks', 'about', 'cost'];

  const tripData = {};

  tripFields.forEach((field) => {
    tripData[field] = $(`#add-trip-form [name$=${field}]`).val();
  });

  return tripData;
};

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
  // trip.save({}, {
  //   success: successfulSave,
  //   error: failedSave
  // });
};

const reserveTrip = function reserveTrip(event) {
  event.preventDefault();
  
};


$(document).ready( () => {
  // load templates
  tripListTemplate = _.template($('#trip-list-template').html());
  tripTemplate = _.template($('#trip-template').html());

  tripList.on('update', renderTripList, tripList);
  $('#trip-list').on('click focus', 'tr', getTrip, this);


  $('.cancel').on('click', cancelSubmit);
  $('#add-trip').on('click', addTrip);

  tripList.fetch();
});
