// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
// CSS
import './css/foundation.css';
import './css/style.css';
// OUR COMPONENTS
import TripList from './collections/trip_list';
import Trip from './models/trip';
import Reservation from './models/reservation'

// TRIP FIELDS
const TRIP_FIELDS = ['id', 'name', 'about', 'continent', 'category', 'weeks', 'cost'];
const RESERVATION_FIELDS = ['name', 'age', 'email'];

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

  // ADD COLOR TO HEADERS
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
};

const createNewTripHandler = function(event) {
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
      console.log('Server response:');
      console.log(response);
    },
    error: (model, response) => {
      console.log('Create new trip: failure');
      console.log('Server response:');
      console.log(response);
    },
  });
};

///// RESERVATION FORM /////
const newReservationHandler = function(event) {
  event.preventDefault();

  const reservationData = {};
  RESERVATION_FIELDS.forEach((field) => {
    const inputElement = $(`#reservation-form input[name="${ field }"]`);
    const value = inputElement.val();
    reservationData[field] = value;
    // clears form after submitted
    inputElement.val('');
  });

  // take reservation trip_id from #trip-about data id
  reservationData.trip_id = $('#trip-about').data('id')
  const reservation = new Reservation(reservationData);
  reservation.save({}, {
    success: (model, response) => {
      console.log(reservation.url());
      console.log('Create new reservation: success');
    },
    error: (model, response) => {
      console.log('Create new reservation: failure');
      console.log('Server response:');
      console.log(response);
    },
  });
};

//////////////////////////
///// DOCUMENT READY /////
$(document).ready(() => {
  // TEMPLATES
  tripsTemplate = _.template($('#trips-template').html());
  aboutTemplate = _.template($('#trip-template').html());
  createNewTripTemplate = _.template($('#create-new-trip-template').html());
  newReservationTemplate = _.template($('#new-reservation-template').html());

  $('#show-trips').on('click', function() {
    console.log('show trips: clicked');
    /// need clarification on this /////
    tripList.on('update', loadTrips);
    tripList.on('sort', loadTrips);
    tripList.fetch({
      success: () => {
        $('#trip-list-table').show();
        console.log('show list table: success');
        $('.hero').animate({height:'40vh'});
      },
    });
  });

  // RENDER SINGLE TRIP DETAILS TO DOM
  $('#trip-list').on('click', 'tr', function() {
    $('.hidden').show();
    const aboutElement = $('#trip-about');
    aboutElement.html('');
    console.log('about: clicked');
    // uses 'data' from html data-id
    let tripID = $(this).data('id');
    // set the id onto #trip-about to be used on reservation form
    $('#trip-about').data('id', tripID);
    console.log(tripID);
    // uses tripID to find api address for single trip
    let singleTrip = new Trip({id: tripID});
    console.log(singleTrip.url());

    // model refers to singleTrip
    // model.fetch(): takes urlRoot and adds id?
    //https://stackoverflow.com/questions/16544984/how-backbone-js-model-fetch-method-works
    singleTrip.fetch({
      success: (model) => {
        const generatedHTML = $(aboutTemplate(model.attributes));
        console.log(generatedHTML);
        // console.log(generatedHTML.prop('outerHTML'));
        aboutElement.html(generatedHTML);

        // RENDER 'RESERVATION' FORM TO DOM
        $('#new-reservation-btn').on('click', function() {

          $('#trip-about').animate({
             scrollTop: $('#trip-about')[0].scrollHeight}, 2000);

          const newReservationElement = $('#new-reservation');
          newReservationElement.html('');
          const generatedHTML = $(newReservationTemplate());
          newReservationElement.html(generatedHTML);

          console.log('load new reservation form: clicked');
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

    console.log('load add new form: clicked');
  });
})

// submit new reservation
$('#trip-about').on('submit', '#reservation-form', newReservationHandler);
// submit new trip
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
