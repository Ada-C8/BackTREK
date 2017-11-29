// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const tripList = new TripList();
tripList.fetch();

let tripTemplate;
const renderTrips = function renderTrips(tripList) {
  $('.reservation-form').hide();
  $('#trip-info').hide();
  $('#trip-list').empty();
  console.log('here i am rendering trips');
  tripList.forEach((trip) => {
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
  $('#trip-list').show();


};

let singleTripTemplate;
const renderOneTrip = function renderOneTrip(id) {
  $('#trip-list').hide();
  $('#trip-info').empty();
  $('#trip-info').show();

  $('.reservation-form').show();

  let trip;
  trip = new Trip({id: id});
  trip.fetch().done(() => {
    $('#trip-info').append(singleTripTemplate(trip.attributes));
  });
};

$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());
  singleTripTemplate = _.template($('#single-trip-template').html());

$('.reservation-form').hide();
$('#trip-list').hide();

  $('#trip-list').on('click', 'tr', function (){
    const tripID = $(this).attr('data-id');
    renderOneTrip(tripID);
  });

  $('#view-all-trips').on('click', function (){
    renderTrips(tripList);
  });

  // tripList.on('update', renderTrips, tripList);


});
