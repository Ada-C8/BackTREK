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

// array of fields
const TRIP_FIELDS = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
const RESERVATION_FIELDS = ['name', 'age', 'email'];
// create variable for using in document.ready
const tripList = new TripList();

//define templates
let tripsTemplate;
let backTemplate;
let headTemplate;
let tripTemplate;
let reserveTemplate;
let addTripTemplate;

const getTrips = function(tripList) {
  let back = backTemplate();
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

  $('nav').on('click', '#new-trip', function() {
    $('#add-trip').append(addTripTemplate);
    $('.wrapper').show();
    $('#add-trip-form').on('submit', addTrip);
  })

  //hide header and #trips button and show nav section
  $('h1').hide();
  $('#trips').hide();
  $('nav').show();
  //fill out .trips section
  $('.trips thead').html(tableHead);
  $('.back').html(back);
  $('.trip').show();
  //fill out .trip section with first trip of collection
  let trip = tripList.first();
  trip.on('change', getTrip);
  trip.fetch();

  //sort by columns in trips table
  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`);
    headerElement.on('click', (event) => {
      console.log(`sorting trips by ${ field }`);
      tripList.comparator = field;
      tripList.sort();
    });
  });

} // end of getTrips

const getTrip = function(trip) {
  console.log('get trip');
  console.log(trip);
  let generatedHTML = tripTemplate(trip.attributes);
  $('#trip').html(generatedHTML);
  $('#reservation').html(reserveTemplate(trip));
  //make new reservation
  $('#reservation-form').on('submit', makeReservation);
} // end of getTrip

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
}

//make reservation
const makeReservation = function(event) {
  console.log('hello');
  event.preventDefault();

  const reservation = new Reservation(readFormData(RESERVATION_FIELDS, '#reservation-form'));
   reservation.set('tripID', $(this).data('id'));

  reservation.save({});
  console.log('reservation was made');
}//and of make reservation

//add new trip
const addTrip = function(event) {
  event.preventDefault();

  const trip = new Trip(readFormData(TRIP_FIELDS, '#add-trip-form'));
  trip.set('id', $(this).cid);
  console.log('my new trip:');
  console.log(trip);

  tripList.add(trip);
  trip.save({});
  console.log('new trip added');
}//end of add trip

$(document).ready( () => {
  //templates
  tripsTemplate = _.template($('#trips-template').html());
  backTemplate = _.template($('#back-button').html());
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
  $('body').on('click', '.back, #title', function() {
    $('.trips thead').html('');
    $('.trips tbody').html('');
    $('.back').html('');
    $('#trips').show();
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
    $('#add-trip').append(addTripTemplate);
    $('.wrapper').show();
    $('#add-trip-form').on('submit', addTrip);
  })















}); //end of ready
