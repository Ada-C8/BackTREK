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

const loadTripDetails = function loadTripDetails(id) {
  // tripList.on('update', renderTrip, trip);
  trip = tripList.get(id);
  trip.fetch( {
    success: events.successfulRender,
    error: events.failedRender,
  });
  console.log(trip);

};

const fields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
const soloTrip = new Trip({
  name: 'Yolo Island',
  continent: 'Pudding',
  category: 'Fish and more',
  weeks: 2,
});
// tripList.add(soloTrip).save();
console.log(soloTrip);

const events = {
  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    fields.forEach( (field) => {
      const val = $(`input[name=${field}]`).val();
      if (val != '') {
        tripData[field] = val;
      }
    });
    const trip = new Trip(tripData);
      console.log('get here');
    if (trip.isValid()) {
      // tripList.add(trip);
      trip.save({}, {
        success: events.successfulSave,
        error: events.failedSave,
      });
      console.log('trying to save a trip');
      console.log(trip);
      $('#status-messages ul').append(`INCOMPLETE Client-side errors`);
      $('#status-messages').show();



    }
  },
  successfulSave(trip, response) {
    tripList.add(trip);
    console.log('successful save!');
    console.log(trip);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`);
    $('#status-messages').show();
  },
  failedSave(trip, response) {
    console.log('error');
    console.log(trip);
    console.log(response);
    console.log(response.responseJSON.errors);
    for (let key in response.responseJSON.errors) {
  response.responseJSON.errors[key].forEach((error) => {
    $('#status-messages ul').append(`<li>${key}: ${error}</li>`);

  });
}},
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
    $('#summary').get(0).scrollIntoView();
  });

  $('#add-trip-form').submit(events.addTrip);
});
