// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from './app/collections/trip_list'
import Trip from './app/models/trip';

console.log('it loaded!');

const tripList = new TripList()

let tripTemplate;

const render = function render(tripList) {
  const $tripElement = $('#trip-list');
  $tripElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    $tripElement.append(generatedHTML)
  });
};

const loadTrips = function loadTrips() {
  tripList.fetch();
  tripList.on('update', render, tripList);
};

console.log(tripList);

// Jquery event handling
$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html())
  $('#trips').hide();

  // renders DOM when a new trip is added to the collection
  tripList.on('update', render, tripList);

  // gets all trips from API
  tripList.fetch()
  console.log(tripList);

  $('#load-trips').on('click', function (){
    $('#trips').show();
    loadTrips()
  });
});
