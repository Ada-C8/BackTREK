// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list'

console.log('it loaded!');

const tripList = new TripList();
let trip;
let tripTemplate;

const render = function render(tripList) {
  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
    // console.log(trip.attributes);
  });
};

// const renderTrip = function renderTrip(trip) {
//     console.log('first line of renderTrip');
//   const $summary = $('#summary');
//   $summary.empty();
//   $summary.append(infoTemplate(trip.attributes));
//     console.log('last line of renderTrip');
//
// };

const loadTrips = function loadTrips(){
  tripList.on('update', render, tripList);
  tripList.fetch();
};

let infoTemplate;

const loadTripDetails = function loadTripDetails(tId) {
  // tripList.on('update', renderTrip, trip);
  trip = tripList.get(tId);
  trip.fetch( {
    success: events.successfulRender,
    error: events.failedRender,
  });
  console.log(trip);

};

const events = {
  successfulRender(trip, response) {
    console.log('success render::::');
    console.log(response)

    const $summary = $('#summary');
    $summary.empty();
    $summary.append(infoTemplate(trip.attributes));
    console.log('last line of renderTrip');
  },
  failedRender(trip, response) {
    console.log('failed render:::::');
    console.log(response);
  }
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  infoTemplate = _.template($('#info-template').html());
  loadTrips();
  $('.all-trips').on('click', function() {
    $('table').toggleClass('active');
  });

  $('#trip-list').on('click', '.trip', function(){
    let tripID = $(this).attr('data-id');
    loadTripDetails(tripID);
  });
});
