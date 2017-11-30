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
  const singleTripTemplate = _.template($('#singleTripTemplate').html());
  const tripList = new TripList();
  tripList.fetch();



  $('#tripButton').on('click',() => {
    console.log('button works');
    tripList.forEach((trip) => {
      // const newTrip = new Trip(trip);
      const generatedHTML = tripTemplate(trip.attributes);
      $('#tripSection').append($(generatedHTML));
    });
  });

  $('#tripSection').on('click', 'tr', (e) => {
    console.log('single trip button worked');
    const baseURL = 'https://ada-backtrek-api.herokuapp.com/trips/'
    $.get(`${baseURL}${e.currentTarget.id}`, (response) => {
      console.log(response);
      const generatedHTML = singleTripTemplate(response);
      console.log(generatedHTML);
      $('#singleTripSection').html(generatedHTML);
    });


  });
});
