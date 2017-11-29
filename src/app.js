// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

//MODELS AND COLLECTIONS
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

//selectors from the DOM
const $tripsList = $('#trips-list')
const $tripDescription = $('#trip-description')
const $newTripBtn = $('#newTripBtn')

//templates
let tripTemplate;
let tripDetailsTemplate;

const tripList = new TripList();

// render trips table
const render = function render(tripList) {
  tripDetailsTemplate = _.template($('#trip-details-template').html());

  $tripsList.empty();
  tripList.forEach((trip) => {
    $tripsList.append(tripTemplate(trip.attributes));
  });
}

const newTrip = function newTrip() {
  console.log('button clicked!');
}


$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());


  // User Events
  $tripsList.on('click', 'tr', function getTrip() {
    const trip = new Trip({ id: $(this).attr('data-id') })

    trip.fetch().done(() => {
      $tripDescription.append(tripDetailsTemplate(trip.attributes));
    });
  });

  $newTripBtn.on('click', newTrip);


  // Data Events
  tripList.on('update', render, tripList);

  // Implement when page loads
  tripList.fetch();
});
