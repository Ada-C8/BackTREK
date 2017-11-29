// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

//MODELS AND COLLECTIONS
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

let tripTemplate;
let tripDetailsTemplate;

const tripList = new TripList();

const $tripsList = $('#trips-list')

const $tripDescription = $('#trip-description')

const render = function render(tripList) {
  $tripsList.empty();
  tripList.forEach((trip) => {
    $tripsList.append(tripTemplate(trip.attributes));
  });
}

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());

  tripDetailsTemplate = _.template($('#trip-details-template').html());

  // User Events
  $tripsList.on('click', 'tr', function getTrip() {
    console.log(this);
    const tripID = $(this).attr('data-id');
    console.log(tripID);
    const trip = new Trip({ id: tripID}).fetch();
    console.log(trip);
    // $tripDescription.append(tripDetailsTemplate);
  });

  // Data Events
  tripList.on('update', render, tripList);

  tripList.fetch();

});
