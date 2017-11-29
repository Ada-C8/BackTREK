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
const renderOneTrip = function renderOneTrip(id) {
  $('#trip-list').hide();
  $('#trip-info').empty();

  let trip;
  trip = new Trip({id: id});
  trip.fetch().done(() => {
    $('#trip-info').append(singleTripTemplate(trip.attributes));
  });
  // console.log(trip);
  // console.log(trip.attributes.id);
  // console.log(trip.attributes.name);
};

$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());
  singleTripTemplate = _.template($('#single-trip-template').html());

$('.reservation-form').hide();

    tripList.on('update', renderTrips, tripList);
    // trip.on('update', renderOneTrip, trip);

    // $('.see-trip').on('click', function(){
    //   console.log('catz');
    //
    //   console.log(this);
    // });
  $('#trip-list').on('click', 'tr', function (){
    const tripID = $(this).attr('data-id');
    renderOneTrip(tripID);
  });


});
