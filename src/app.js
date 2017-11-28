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

const tripList = new TripList();

const render = function render(tripList) {
  console.log(tripList);
  const $trips = $('#trips')
  $trips.empty();
  tripList.forEach((trip) => {
    $trips.append(tripTemplate(trip.attributes));
    console.log(trip.attributes);
    // console.log('trip loaded!');
    // console.log(trip);
  });
}


$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());


  tripList.on('update', render, tripList);

  tripList.fetch();

});
