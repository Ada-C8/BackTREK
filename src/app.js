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

const getTripDetails = function getTripDetails(attrID) {
  console.log('View Trip Row clicked');

  const trip = new Trip({ id: attrID });
  trip.fetch();

  console.log(trip)
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

  // To view a single Trip
  $('#all-trips-table').on('click', '.trip', function() {
    //console.log('Button trip details clicked');
    let tripID = $(this).attr('data-id');
    getTripDetails(tripID);
  });
});
