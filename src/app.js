// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from '.app/models/trip';
import TripList from '.app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();
let tripTemplate;

const render = function render(tripList) {

  // Get the element to append to
  const $tripList = $('#trip-list');
  $tripList.empty();

  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
  });
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripList.on('update', render, tripList);
  tripList.fetch();
  // $('main').html('<h1>Hello World!</h1>');
});
