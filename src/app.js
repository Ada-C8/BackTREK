// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import Trip from './app/models/trip';
import TripList from './app/collections/tripList';

// CSS
import './css/foundation.css';
import './css/style.css';


const loadTrips = function loadTrips(trips) {
  console.log('function working');
  console.log(trips);
  const tripTable = $('#tripSection');
  tripTable.html('');
  trips.forEach((trip) => {
    const generatedHTML = tripTemplate(trip.attributes);
    tripTable.append(generatedHTML);
  });
}

$(document).ready( () => {
  const tripTemplate = _.template($('#tripTemplate').html());
  const tripList = new TripList();
  tripList.fetch();



  $('#tripButton').on('click',() => {
    console.log('button works');
    tripList.forEach((trip) => {
      const newTrip = new Trip(trip);
      const generatedHTML = tripTemplate(newTrip);
      $('#tripSection').append($(generatedHTML));
    });
  });
});
