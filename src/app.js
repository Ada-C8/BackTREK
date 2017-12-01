// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

//console.log('it loaded!');

//TRIPS TABLE:
const tripList = new TripList();
let tripsTemplate;

const renderTrips = function renderTrips(tripList) {
  console.log('it loaded!');
  tripsTemplate = _.template($('#trips-template').html());
  //get the element to append to
  const tripListTable = $('#trips-list');
  tripListTable.empty();
  tripList.forEach((trip) => {
    tripListTable.append(tripsTemplate(trip.attributes));
    //console.log(trip);
  });
};

//TRIP DETAILS (ONE TRIP)
let singleTripTemplate;
const renderSingleTrip = function renderSingleTrip(tripID) {
  console.log('it loaded a trip!');
  console.log(tripID);
  const tripDetailsContainer = $('#trip-details-container');
  tripDetailsContainer.empty();
  //why am i defining let singleTripTemplate outsie of method instead of inside?
  singleTripTemplate = _.template($('#single-trip-template').html());
  let trip;
  trip = new Trip({id: tripID});
  trip.fetch().done(() => {
    $('#trip-details-container').append(singleTripTemplate(trip.attributes));
  });
  console.log(trip);
}

$(document).ready( () => {

  $('#add-a-trip-form-container').hide();
  $('#trips-table-container').hide();
  $('.clear').hide();

  $('#load-trips').on('click', function(){
    $('#trips-table-container').show();
    tripList.fetch();
    // createFilters();
  });

  $('#trips-table-container').on('click', 'tr', function () {
    const tripID = $(this).attr('data-id');
    renderSingleTrip(tripID);
  });

  tripList.on('update', renderTrips, tripList);





  // $('.sort').click(events.sortTrips);
  // tripList.on('sort',renderTrips,tripList);


});
