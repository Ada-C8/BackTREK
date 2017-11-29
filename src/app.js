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
    // console.log(trip);
    // console.log(trip.attributes.category);
    $tripsList.append(tripTemplate(trip.attributes));
  });
}

// const renderTrip = function tripRender(trip) {
//   console.log('rendering a change for at trip!')
//   console.log(this);
//   console.log(trip);
//   $tripDescription.empty();
//   $tripDescription.append(tripDetailsTemplate(trip.attributes));
// }

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());

  tripDetailsTemplate = _.template($('#trip-details-template').html());

  // User Events
  $tripsList.on('click', 'tr', function getTrip() {
    const tripID = $(this).attr('data-id');

    const trip = new Trip({ id: tripID })

    console.log(`aaaa${tripID}`)
    trip.fetch().done(() => {
      console.log(trip.attributes);
      console.log(trip.attributes.category);
      $tripDescription.append(tripDetailsTemplate(trip.attributes));
    });
  });

  // Data Events
  tripList.on('update', render, tripList);


  tripList.fetch();

});
