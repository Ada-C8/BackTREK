// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const tripList = new TripList();
let allTripsTemplate;
let tripHeadersTemplate;
let showTripTemplate;
let addTripTemplate;

const url = 'https://ada-backtrek-api.herokuapp.com/trips';
const fields = ['id', 'name', 'continent', 'category', 'weeks', 'cost'];

const loadTrips = function loadTrips() {
  $('.content').empty();
  fields.forEach((field) => {
    $('#trip-headers').append(tripHeadersTemplate({header: field}))
  });
  tripList.forEach((trip) => {
    $('#all-trips').append(allTripsTemplate(trip.attributes));
  });
};

const showTrip = function showTrip(event) {
  $('.content').empty();
  const tripId = event.currentTarget.id;
  const tripUrl = `${url}/${tripId}`;
  $.get(tripUrl, (response) => {
    if (response.weeks === 1) {
      response.plural = ''
    } else {
      response.plural = 's'
    }
    $('#show-trip').append(showTripTemplate(response));
  })
};

const addTripForm = function addTripForm() {
  $('.content').empty();
  fields.forEach((item) => {
    $('#add-trip-form').append(addTripTemplate({field: item, lowercaseField: item}));
  });
  $('#add-trip-form').append('<section><button type="submit" class="button">Submit</button></section></form>');
}

const saveTrip = function saveTrip(event) {
  event.preventDefault();
  // TODO: save the trip to the API
}

$(document).ready( () => {
  allTripsTemplate = _.template($('#all-trips-template').html());
  tripHeadersTemplate = _.template($('#trip-headers-template').html());
  showTripTemplate = _.template($('#show-trip-template').html());
  addTripTemplate = _.template($('#add-trip-template').html());
  $('#load-trips').on('click', loadTrips);
  $('#all-trips').on('click', '.trip', showTrip);
  $('#add-trip').on('click', addTripForm);
  $('#add-trip-form').on('submit', saveTrip);
  tripList.fetch();
});
