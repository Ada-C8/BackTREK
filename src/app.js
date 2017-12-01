// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// OUR COMPONENTS
import TripList from './collections/trip_list';
import Trip from './models/trip';

// TRIP FIELDS
const TRIP_FIELDS = ['id', 'name', 'about', 'continent', 'category', 'weeks', 'cost'];

const tripList = new TripList();

// TEMPLATES
///// still confused why /////
let tripsTemplate;
let aboutTemplate;
let createNewTripTemplate;
let newReservationTemplate;

// render list of trips
const loadTrips = function loadTrips(tripList) {
  const tripsTableElement = $('#trip-list');
  tripsTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripsTemplate(trip.attributes));
    tripsTableElement.append(generatedHTML);
  });
  // Provide visual feedback for sorting
  // $('th.sort').removeClass('current-sort-field');
  // $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

const createNewTripHandler = function(event) {
  event.preventDefault();

  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    const inputElement = $(`#trip-create-new input[name="${ field }"]`);
    const value = inputElement.val();
    tripData[field] = value;

    inputElement.val('');
  });

  const trip = tripList.add(tripData);
  trip.save({}, {
    success: (model, response) => {
      console.log('Create new trip: success');
    },
    error: (model, response) => {
      console.log('Create new trip: failure');
      console.log('Server response:');
      console.log(response);
    },
  });
};

$(document).ready(() => {
  // templates
  tripsTemplate = _.template($('#trips-template').html());
  aboutTemplate = _.template($('#trip-template').html());
  createNewTripTemplate = _.template($('#create-new-trip-template').html());
  newReservationTemplate = _.template($('#new-reservation-template').html());

  tripList.on('update', loadTrips);
  tripList.on('sort', loadTrips);
  tripList.fetch();

  // render single trip details using 'click'
  $('#trip-list').on('click', 'tr', function() {
    const aboutElement = $('#trip-about');
    aboutElement.html('');

    console.log('clicked');
    let tripID = $(this).data('id');
    console.log(tripID);
    let singleTrip = new Trip({id: tripID});
    console.log(singleTrip.url());

    singleTrip.fetch({
      success: (model) => {
        const generatedHTML = $(aboutTemplate(model.attributes));
        aboutElement.html(generatedHTML);
      },
    });
  })

  $('#trip-create-new-btn').on('click', function() {
    const newTripElement = $('#trip-create-new');
    newTripElement.html('');
    const generatedHTML = $(createNewTripTemplate());
    newTripElement.html(generatedHTML);

    console.log('clicked');
    console.log('load add new form: success');
  });
})

$('#trip-create-new').on('submit', createNewTripHandler);

TRIP_FIELDS.forEach((field) => {
  const headerElement = $(`th.sort.${ field }`);
  headerElement.on('click', (event) => {
    console.log(`Sorting table by ${ field }`);
    tripList.comparator = field;
    tripList.sort();
  });
});
