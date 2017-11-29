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

// let singleTripTemplate;

// let trip;

// const renderOneTrip = function renderOneTrip() {
//   trip = new Trip();
//   trip.fetch();
//   console.log(trip);
//   const $tripInfo = $('#trip-info');
//   $tripInfo.empty();
//   $tripInfo.append(singleTripTemplate(trip.attributes));
// };

$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());
  // singleTripTemplate = _.template($('#single-trip-template').html());


$('.reservation-form').hide();

  // $('.view-all-trips').on('click', function(){
    tripList.on('update', renderTrips, tripList);
    // trip.on('update', renderOneTrip, trip);

    let specialTrip = new Trip({id: 25});
    specialTrip.fetch().done();
    console.log(specialTrip.attributes);
  // });




});
