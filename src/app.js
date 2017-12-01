// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

let tripList;
let tripTemplate;
let tripDetailsTemplate;
let statusMessageTemplate;

console.log('it loaded!');

const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();
  console.log(tripList);

  tripList.forEach((trip) => {
    tripListElement.append(tripTemplate(trip.attributes));
  });
};

const loadTrips = function loadTrips() {
  tripList.fetch();
  tripList.on('update', render, tripList);
  $('#trips').show();
};

$(document).ready( () => {
  $('#trips').hide();
  tripTemplate = _.template($('#trip-template').html());
  tripDetailsTemplate = _.template($('#trip-details-template').html());
  statusMessageTemplate = _.template($('#status-message-template').html());

  tripList = new TripList();

  $('button#search').on('click', loadTrips);
  $('#trip-list').on('click', 'tr', function() {
    tripList.fetch($(this).attr('data-id'));
    console.log('clicked!');
  });
});
