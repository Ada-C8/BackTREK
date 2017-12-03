// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

let tripList;
let tripTemplate;
let tripDetailsTemplate;
let statusMessageTemplate;

console.log('it loaded!');

const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    tripListElement.append(tripTemplate(trip.attributes));
  });

  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

const reportStatus = function reportStatus(status, message) {
  const generatedHTML = statusMessageTemplate({
    status: status,
    message: message,
  });

  $('#status-messages ul').append(generatedHTML);
  $('#status-messages').show();
};

const loadTrips = function loadTrips() {
  tripList.fetch();
  tripList.on('update', render, tripList);
  $('#trips').show();
};

const loadTrip = function loadTrip(trip) {
  $('#trips').hide();
  $('#trip').empty();
  console.log(trip);
  $('#trip').append(tripDetailsTemplate(trip.attributes));
};

$(document).ready( () => {
  $('#trips').hide();
  tripTemplate = _.template($('#trip-template').html());
  tripDetailsTemplate = _.template($('#trip-details-template').html());
  statusMessageTemplate = _.template($('#status-message-template').html());

  tripList = new TripList();

  tripList.on('update', render, tripList);
  tripList.on('sort', render, tripList);

  $('button#search').on('click', loadTrips);
  $('#trip-list').on('click', 'tr', function() {
    const trip = tripList.get($(this).attr('data-id'));
    console.log('clicked!');
    trip.fetch({}, {
    success: loadTrip(trip),
    error: reportStatus,
    });
  });

  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`.sort.${ field }`);
    headerElement.on('click', () => {
      tripList.comparator = field;
      tripList.sort();
    });
  });
});
