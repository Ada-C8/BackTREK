// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// Vars that need to be defined up front
let tripRowTemplate;
let tripDetailsTemplate;
let trip = new Trip();
const tripList = new TripList();

// Callback functions
const render = function render(tripList) {
  $('#trip-list').empty(); // clear it so it doesn't continually add on
  tripList.forEach((trip) => {
    // use template to append trip row to table in the DOM
    $('#trip-list').append(tripRowTemplate(trip.attributes));
  });
};

const getTrip = function getTrip() {
  const id = $(this).attr('id');
  trip = tripList.get(id);
  trip.fetch({success: events.successfulGetTrip, error: events.failedGetTrip});
};

const getTripList = function getTripList() {
  tripList.fetch({success: events.successfulGetTripList, error: events.failedGetTripList});
}

const events = {
  successfulGetTrip(trip, response) {
    $('#trip-info').empty();
    $('#trip-info').append(tripDetailsTemplate(trip.attributes))
  },
  failedGetTrip(trip, response) {
    $('.trip-not-found').show();
  },
  successfulGetTripList(tripList, response) {
    $('#trip-table').show();
  },
  failedGetTripList(tripList, response) {
    $('.list-not-found').show();
  }
};


$(document).ready( () => {
  tripRowTemplate = _.template($('#trip-row-template').html());
  tripDetailsTemplate = _.template($('#trip-details-template').html());

  $('#explore-trips').on('click', getTripList);

  tripList.on('update', render, tripList)

  $('#trip-list').on('click', 'tr', getTrip);
});
