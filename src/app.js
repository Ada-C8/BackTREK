// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();
let tripTemplate;
let atripTemplate;

const render = function render(tripList) {
  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
  });
};

const events = {
  showTrips() {
    $('#trips-table').toggle({'display': 'block'});
  }
};

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  atripTemplate = _.template($('#atrip-template').html());
  $('#load').on('click', function() {
      events.showTrips();
  });
  tripList.on('update', render, tripList);
  tripList.fetch();
  // $('main').html('<h1>Hello World!</h1>');
});
