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

console.log('here is the triplist');

console.log(tripList);

let tripTemplate;

const render = function render(tripList) {
  console.log(tripList);
  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    console.log(trip)
    $tripList.append(tripTemplate(trip.attributes));
  });
};

$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());

$('.reservation-form').hide();

  // $('.view-all-trips').on('click', function(){
    tripList.on('update', render, tripList);
  // });


});
