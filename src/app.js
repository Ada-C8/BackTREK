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
  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
  });
};

let singleTripTemplate;


const renderOneTrip = function renderOneTrip() {
  let trip;
  console.log('in render one trip');
  trip = new Trip({id: 25});
  trip.fetch().done();
  console.log(trip.attributes);
  const $tripInfo = $('#trip-info');
  // $tripInfo.empty();
  $('#trip-list').hide();
  $('#trip-info').append(singleTripTemplate(trip.attributes));
  $('#trip-info').append('<p>i appended this</p>');

  $tripInfo.show();
};

$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());
  singleTripTemplate = _.template($('#single-trip-template').html());


$('.reservation-form').hide();

  // $('.view-all-trips').on('click', function(){
    tripList.on('update', renderTrips, tripList);
    // trip.on('update', renderOneTrip, trip);
    $('#trip-info').append('<p>this is what i appended in document ready first</p>');

    renderOneTrip();
    $('#trip-info').append('<p>this is what i appended in document ready last</p>');

    // let specialTrip = new Trip({id: 25});
    // specialTrip.fetch().done();
    // console.log(specialTrip.attributes);
  // });




});
