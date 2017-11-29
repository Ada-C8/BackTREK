// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// MODELS
import Trip from './app/models/trip';

// COLLECTION
import TripList from './app/collections/trip_list';

// INITITAL SET UP CHECK
console.log('it loaded!');

const tripList = new TripList();
// console.log('TRIPLIST:');
// console.log(tripList);

let tripTemplate;

const render = function render(tripList) {
  console.log('TOP OF RENDER')
  console.log(tripList);
  const $tripList = $('#trip-list');
  //Clears the list so when you re-render it doesn't print duplicates
  $tripList.empty();

  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
    console.log(trip.attributes);
  });
};

const loadTrips = function loadTrips() {
  tripList.fetch();
  tripList.on('update', render, tripList);
};

$(document).ready( () => {
  $('#all-trips-table').hide();
  tripTemplate = _.template($('#trip-template').html());

  // EVENTS
  // To view All Trips
  $('#all-trips').on('click', function() {
    $('#all-trips-table').show();
    loadTrips();
  });
});
