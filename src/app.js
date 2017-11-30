// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

console.log('it loaded!');

//////////////////////// ALL TRIPS ///////////////////////////

// Create a new collection of all trips
const tripList = new TripList();

// Create a template for all trips to append to the page
const listTemplate = _.template($('#trip-template').html());

const renderList = function renderList() {
  tripList.forEach((trip) => {
    let generatedHtml = listTemplate(trip.attributes);
    $('#trip-list').append(generatedHtml);
    $(`#trip${ trip.id }`).click(function() {
      showTrip(trip.id);
      // let singleTrip = tripList.findWhere({id: tripID});
    });
  });
};

//////////////////////// SINGLE TRIP ///////////////////////////

const singleTripTemplate = _.template($('#trip-info-template').html());

// TODO: FIX SINGLE TRIP SOMEHOW TO USE THE URL OF THE TRIP MODEL
const showTrip = function showTrip(tripID) {
  let singleTrip = tripList.findWhere({id: tripID});
  singleTrip.fetch({
    success: (model, response) => {
      console.log('Model: ' + singleTrip.parse(model));
      console.log('Response: ' + response);
      renderInfo(model);
    },
  });
};

const renderInfo = function renderInfo(trip) {
  let generatedHtml = singleTripTemplate(trip.attributes);
  $('#trip-info').append(generatedHtml);
  $('#reserve-form').on('submit', (event) => {
    event.preventDefault();
    reserveTripHandler();
  });

  console.log('THE CALL BACK FUNCTION WORKS!!');
};

//////////////////////// NEW TRIP ///////////////////////////

// Create new trip HTML fields
const TRIP_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost']

const newTripHandler = () => {
  let tripData = {};
  TRIP_FIELDS.forEach((field) => {
    const inputElement = $(`#new-trip-form input[name="${ field }"]`);
    const value = inputElement.val();
    tripData[field] = value;
  });

  let newTrip = new Trip(tripData);

  newTrip.save({}, {
    success: (model, response) => {
      tripList.add(model);
    },
    error: (model, response) => {
      console.log(response);
    },
  });
};

//////////////////////// RESERVE TRIP ///////////////////////////

const RESERVE_FIELDS = ['name', 'age', 'email', 'tripId'];

const reserveTripHandler = () => {
  let reservation = {};
  RESERVE_FIELDS.forEach((field) => {
    const inputElement = $(`#reserve-form [name="${ field }"]`);
    const value = inputElement.val();
    reservation[field] = value;
  });

  let newReservation = new Reservation(reservation);
  console.log('Reservation ID: ' + newReservation.attributes);
  newReservation.save({}, {
    success: (model, response) => {
      console.log('Your reservation has been saved!');
      $('#reserve-form').reset();
    },
    error: (model, response) => {
      console.log(response);
    },
  });
};

$(document).ready(() => {
  $('#create-trip-form').hide();
  // $('#reserve-wrapper').hide();
  // $('#trip-list').empty();

  tripList.fetch();

  // Listen and register. Once an update has been heard, render all the collection into the template
  tripList.on('update', renderList);

  // Render form when the button is clicked
  $('#create-trip').on('click', (event) => {
    $('#create-trip-form').show();
  });

  // On click when creating a new trip
  $('#new-trip-form').on('submit', (event) => {
    event.preventDefault();
    newTripHandler();
  });
});
