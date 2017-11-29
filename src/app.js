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

let tripTemplate;

const render = function render(tripList) {
  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
    console.log(trip.attributes);
  });

};

const loadTrips = function loadTrips(){
  tripList.on('update', render, tripList);
  tripList.fetch();
};
let infoTemplate;

const loadTripDetails = function loadTripDetails(tId) {
  let trip = new Trip({id: tId}).fetch().done();
  const $summary = $('#summary');
  $summary.empty();
  $summary.append(infoTemplate(trip.attributes));
  console.log(trip);

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
