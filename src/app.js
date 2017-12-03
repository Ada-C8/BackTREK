// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// CLASSES
import Trip from 'app/models/trip';
import TripList from 'app/collections/trip_list';
import Reservation from 'app/models/reservation';

console.log('it loaded!');

// variables
const TRIP_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
const RESERVATION_FIELDS = ['name', 'age', 'email'];
const CONTINENTS = ['Africa', 'Antartica', 'Asia', 'Australasia', 'Europe', 'North America', 'South America'];
// create variable for using in document.ready
const tripList = new TripList();

//define templates
let tripsTemplate;
let backTemplate;
let headTemplate;
let tripTemplate;
let reserveTemplate;
let addTripTemplate;

//define global variable
var showFirst = false;

//Validation handling
const handleValidationFailures = function(errors) {
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('errors', `${ field }: ${ problem }`);
    }
  }
};

//clear status messages
const clearStatus = function() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
}

//add a new status message
const reportStatus = function(status, message) {
  const statusHTML = `<li class="${ status }">${ message }</li>`;
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
}

//get all trips
const getTrips = function(tripList) {
  let tableHead = headTemplate();

  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  for (let trip of tripList.models) {
    const generatedHTML = $(tripsTemplate(trip.attributes));
    // generatedHTML.on('click', (event) => {
    //   getTrip(trip);
    // });
    tripTableElement.append(generatedHTML);
  }

  //hide header and #trips button and show nav section
  $('h1').hide();
  $('#trips').hide();
  $('nav').show();

  //fill out .trips section
  $('.trips thead').html(tableHead);
  $('.trip').show();

  //fill out .trip section with first trip of collection
  if (showFirst === false) {
    let trip = tripList.first();
    trip.on('change', getTrip);
    trip.fetch();
    showFirst = true;
  }

  //sort by columns in trips table
  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`sorting trips by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

  //provide visual feedback for sorting
  $('th.sort').removeClass('sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('sort-field');


}; // end of getTrips

const getTrip = function(trip) {
  console.log('get trip');
  console.log(trip);
  let generatedHTML = tripTemplate(trip.attributes);
  $('#trip').html(generatedHTML);
  $('#reservation').html(reserveTemplate(trip));
  //make new reservation
  $('#reservation-form').on('submit', makeReservation);
}; // end of getTrip

// read data from forms
const readFormData = function(formFields, form) {
  const formData = {};
  formFields.forEach((field) => {
    const inputElement = $(`${ form } input[name="${ field }"]`);
    const value = inputElement.val();
    formData[field] = value;
    //reset the form after submitting the input
    inputElement.val('');
  });
  console.log(formData);
  return formData;
};

//make reservation
const makeReservation = function(event) {
  console.log('hello');
  event.preventDefault();

  const reservation = new Reservation(readFormData(RESERVATION_FIELDS, '#reservation-form'));

  if (!reservation.isValid()) {
    clearStatus();
    handleValidationFailures(reservation.validationError);
    return;
  }

   reservation.set('tripID', $(this).data('id'));

  reservation.save({}, {
    success: (model, response) => {
      console.log('reservation was made');
      clearStatus();
      reportStatus('success', 'Successfully made new reservation!');
    },
    error: (model, response) => {
      clearStatus();
      handleValidationFailures(response.responseJSON['errors']);
    }
  });
};//and of make reservation

//add new trip
const addTrip = function(event) {
  event.preventDefault();

  const trip = new Trip(readFormData(TRIP_FIELDS, '#add-trip-form'));

  if (!trip.isValid()) {
    clearStatus();
    handleValidationFailures(trip.validationError);
    return;
  }

  trip.set('id', $(this).cid);
  console.log('my new trip:');
  console.log(trip);

  tripList.add(trip);
  trip.save({}, {
    success: (model, response) => {
      console.log('new trip added');
      clearStatus();
      reportStatus('success', 'Successfully saved new trip!');
    },
    error: (model, response) => {
      tripList.remove(model);
      clearStatus();
      handleValidationFailures(response.responseJSON['errors']);
    }
  });
};//end of add trip

$(document).ready( () => {
  //templates
  tripsTemplate = _.template($('#trips-template').html());
  headTemplate = _.template($('#tripsHead').html());
  tripTemplate = _.template($('#trip-template').html());
  reserveTemplate = _.template($('#reserve-form-template').html());
  addTripTemplate = _.template($('#trip-form-template').html());

  //get all trips on click
  $('main').on('click', '#trips', function() {
    tripList.on('update', getTrips);
    tripList.on('sort', getTrips);
    tripList.fetch();
  })

  //go back from trips
  $('body').on('click', 'nav h2', function() {
    $('.trips thead').html('');
    $('.trips tbody').html('');
    $('#trips').show();
    $('.trip').hide();
    $('nav').hide();
    $('header h1').show();
  })

  //get trip info
  $('.trips').on('click', 'table tbody tr', function() {
    let tripID = $(this).attr('data-id');
    let trip = tripList.findWhere({ id: parseInt(tripID) });
    trip.fetch({
      success: (model, response) => {
        console.log('success');
        getTrip(model);
      }
    })
    // trip.on('change', getTrip);
    // trip.fetch();
  })

  // add new trip
  $('nav').on('click', '#new-trip', function() {
    $('#add-trip').append(addTripTemplate({continents: CONTINENTS}));
    $('.wrapper').show();
    $('#add-trip-form').on('submit', addTrip);
  })















}); //end of ready
