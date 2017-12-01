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

// Trip COLLECTION
const tripList = new TripList();

// TEMPLATES
///// still confused why /////
let tripsTemplate;
let aboutTemplate;
let createNewTripTemplate;
let newReservationTemplate;

// RENDER LIST OF TRIPS
const loadTrips = function loadTrips(tripList) {
  const tripsTableElement = $('#trip-list');
  tripsTableElement.html('');

  tripList.forEach((trip) => {
    const generatedHTML = $(tripsTemplate(trip.attributes));
    tripsTableElement.append(generatedHTML);
  });
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

const newReservationHandler = function(event) {
  // keep it from doing normal form things
  event.preventDefault();

  /////////////////////////////
  // read information from form
  const reservationData = {};
  TRIP_FIELDS.forEach((field) => {
    const inputElement = $(`#reservation-form input[name="${ field }"]`);
    const value = inputElement.val();
    reservationData[field] = value;

    // clears form after submitted
    inputElement.val('');
  });

  ///////////////////////////////
  ///////////////////////////////
  const reservation = tripList.add(reservationData);
  reservation.save({}, {
    success: (model, response) => {
      console.log('Create new reservation: success');
    },
    error: (model, response) => {
      console.log('Create new reservation: failure');
      console.log('Server response:');
      console.log(response);
    },
  });
};

const createNewTripHandler = function(event) {
  // keep it from doing normal form things
  event.preventDefault();

  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    const inputElement = $(`#trip-create-new input[name="${ field }"]`);
    const value = inputElement.val();
    tripData[field] = value;

    // clears form after submitted
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
  // TEMPLATES
  tripsTemplate = _.template($('#trips-template').html());
  aboutTemplate = _.template($('#trip-template').html());
  createNewTripTemplate = _.template($('#create-new-trip-template').html());
  newReservationTemplate = _.template($('#new-reservation-template').html());

  ///// need clarification on this /////
  tripList.on('update', loadTrips);
  tripList.on('sort', loadTrips);
  tripList.fetch();

  // RENDER SINGLE TRIP DETAILS TO DOM
  $('#trip-list').on('click', 'tr', function() {
    const aboutElement = $('#trip-about');
    aboutElement.html('');

    console.log('clicked');
    // uses 'data' from html data-id
    let tripID = $(this).data('id');
    console.log(tripID);
    // uses tripID to find api address for single trip
    let singleTrip = new Trip({id: tripID});
    console.log(singleTrip.url());

    let suffix = '/reservations'
    let newReservation = new Trip({id: tripID + suffix});
    console.log(newReservation.url());

    // apparently 'model' is cheating???
    // model refers to singleTrip?
    // model.fetch(): takes urlRoot and adds id?
    //https://stackoverflow.com/questions/16544984/how-backbone-js-model-fetch-method-works
    singleTrip.fetch({
      success: (model) => {
        const generatedHTML = $(aboutTemplate(model.attributes));
        aboutElement.html(generatedHTML);

        ///////////////////////////////////
        // RENDER 'RESERVATION' FORM TO DOM
        ///////////////////////////////////
        $('#new-reservation-btn').on('click', function() {
          const newReservationElement = $('#new-reservation');
          newReservationElement.html('');
          const generatedHTML = $(newReservationTemplate());
          newReservationElement.html(generatedHTML);

          console.log('clicked');
          console.log('load new reservation form: success');
        });
      },
      error: (model) => {
        console.log('singleTrip fetch: failure');
        console.log(response);
      },
    });
  })

  // RENDER 'ADD NEW' FORM TO DOM
  $('#trip-create-new-btn').on('click', function() {
    const newTripElement = $('#trip-create-new');
    newTripElement.html('');
    const generatedHTML = $(createNewTripTemplate());
    newTripElement.html(generatedHTML);

    console.log('clicked');
    console.log('load add new form: success');
  });
})

/////////////////////////////////
// MAKE NEW RESERVATION FROM FORM
$('#reservation-form').on('submit', newReservationHandler);

// SUBMIT NEW TRIP FROM FORM
$('#trip-create-new').on('submit', createNewTripHandler);

// SORT BY CLICKED FIELD
TRIP_FIELDS.forEach((field) => {
  const headerElement = $(`th.sort.${ field }`);
  headerElement.on('click', (event) => {
    console.log(`Sorting table by ${ field }`);
    tripList.comparator = field;
    tripList.sort();
  });
});
