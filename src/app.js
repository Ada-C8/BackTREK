// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from './app/models/trip';
import TripList from './app/collections/tripList';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

const tripList = new TripList();

const getAllTrips = {
  getAllTrips() {
    const $tripList = $('#tripSection');
    $tripList.empty();
    event.preventDefault();
    tripList.forEach((trip) => {
      $tripList.append(tripTemplate(trip.attributes));
    });
}};

$(document).ready( () => {
  const tripTemplate = _.template($('#tripTemplate').html());
  tripList.fetch();
  $('#tripButton').on('click', getAllTrips);
  console.log(tripList);
});
