// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

console.log('it loaded!');

import Trip from './app/models/trip'

import TripList from './app/collections/trip_list';

import Reservation from './app/models/reservation'


const TEXT_SEARCH = ['name', 'continent', 'category'];

const TRIP_FIELDS = ['name', 'about', 'continent', 'category', 'weeks', 'cost'];
const RESERVATION_FIELDS = ['tripId', 'name', 'email', 'age'];

const trips = new TripList();

let tripTemplate;

let showTripTemplate;

// Clear status messages
const clearStatus = function clearStatus() {
  $('#status-messages ul').html('');
  $('#status-messages').hide();
};

// Add a new status message
const reportStatus = function reportStatus(status, message) {
  // console.log(`Reporting ${ status } status: ${ message }`);

  // TODO: use an underscore method for this
  // Should probably use an Underscore template here.

  const statusHTML = `<li class="${ status }">${ message }</li>`;

  // note the symetry with clearStatus()
  $('#status-messages ul').append(statusHTML);
  $('#status-messages').show();
};

// TODO: pull out into function so can DRY saving reservation and trip models
const saveModel = function saveModel(modelToAdd, collection = 'none') {
  modelToAdd.save({}, {
    success: (model, response) => {
      console.log(`Successfully saved!`);
      if(collection != 'none') {
        collection.add(model);
      }
      reportStatus('success', `Successfully saved!`);
    },
    error: (model, response) => {
      console.log('Failed to save! Server response:');
      console.log(response);
      const errors = response.responseJSON["errors"];
      handleValidationFailures(response.responseJSON["errors"]);
    },
  });
};



const render = function render(trips) {

  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  trips.forEach((trip) => {
    // console.log(trip)
    const generatedHTML = tripTemplate(trip.attributes);

    tripTableElement.append(generatedHTML);
    // console.log(trip.attributes.id);

    // $('#trip-list ').attr('trip-id').val(`${trip.attributes.id}`);
    // console.log(`${trip.attributes.id}`)
    // data-id=${trip.id}
  });
  $('#trips').show();

  // provide visual feedback for sorting
  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ trips.comparator }`).addClass('current-sort-field');
};

const showTrip = function showTrip(id) {
  const singleTrip = $('#show-trip');

  const trip = trips.findWhere({id: parseInt(id)});

  trip.fetch({
    success: (model, response) => {
      console.log('Successfully found trip!');
      console.log(response);

      const generatedHTML = showTripTemplate(response);
      singleTrip.html(generatedHTML);
      $('#reserve-trip-form').on('submit', function(ev) {
        ev.preventDefault();
        addReservationHandler();
      })
    },
  })
  $('#show-trip').show();

  console.log(`this is the show trip click event`);
  console.log(event);
  console.log(`this is the show trip id ${id}`);
};

const readFormData = function readFormData() {
  const tripData = {};

  TRIP_FIELDS.forEach((field) => {


    const inputElement = $(`#add-trip-form input[name="${ field }"]`);
    const value = inputElement.val();

    tripData[field] = value;
    // TODO: see below
    // clears the field
    // break this out into a clear inputs and a method that reads inputs and one that does both
    // methods that don't have side effects
    // pure functions are guaranteed to be idempotent
    //TODO: check
    // inputElement.val('');


  });

  return tripData;
};

const handleValidationFailures = function handleValidationFailures(errors) {
  for (let field in errors) {
    for (let problem of errors[field]) {
      reportStatus('error', `${field}: ${problem}`);
    }
  }
};

const addReservationHandler = function(ev) {
  console.log('in addReservationHandler')
  const reservationData = {};

  RESERVATION_FIELDS.forEach((field) => {

    const inputElement = $(`#reserve-trip-form input[name="${ field }"]`);

    const value = inputElement.val();
    console.log(field);
    console.log(value);

    reservationData[field] = value;
    // clears the field
    // break this out into a clear inputs and a method that reads inputs and one that does both
    // methods that don't have side effects
    // pure functions are guaranteed to be idempotent
    //TODO: check
    // inputElement.val('');
  });

  console.log(reservationData)
  const reservation = new Reservation(reservationData);

  if (!reservation.isValid()) {
    handleValidationFailures(reservation.validationError);
    return;
  }
  console.log(reservation);

  saveModel(reservation);
}

const addTripHandler = function(event) {
  event.preventDefault();
  // const tripData = {};
  // console.log('in trip handler');
  //
  // TRIP_FIELDS.forEach((field) => {
  //
  //   const inputElement = $(`#add-trip-form input[name="${ field }"]`);
  //   const value = inputElement.val();
  //   tripData[field] = value;
  //   // clears the field
  //   inputElement.val('');
  // });


  console.log('read trip data');
  // console.log(readFormData());

  const trip = new Trip(readFormData());
  //const trip = trips.add(tripData);
  if (!trip.isValid()) {
    handleValidationFailures(trip.validationError);
    return;
  }
  console.log(trip);
  // console.log(trip.url)


  saveModel(trip, trips);
};

$(document).ready( () => {

  tripTemplate = _.template($('#trip-template').html());
  showTripTemplate = _.template($('#show-trip-template').html());

  trips.on('update', render)
  trips.on('sort', render);

  trips.fetch();
  // console.log(trips);

  $('#add-trip-form').on('submit', addTripHandler);
  // TODO: FIX LOAD TRIPS BUTTON
  // $('#load-trips').on('click', render);

  $('#load-add-trip').on('click', () => $('#add-trip').toggle());

  $('#trip-list').on('click', 'tr td', function () {
    // event.preventDefault();
    // event.stopPropagation();
    let tripId = $(this).attr('data-id');
    console.log(`this is the trip id ${$(this).attr('data-id')}`);
    // render();
    showTrip(tripId);
  });




  TRIP_FIELDS.forEach((field) => {
    const headerElement = $(`th.sort.${ field }`)
    headerElement.on('click', (event) => {
      console.log(`Sorting table by ${ field }`);
      trips.comparator = field
      trips.sort();
    });

  });


  $('#status-messages button.clear').on('click', clearStatus);

  // TODO: continue implementing filtering if time allows and move collection filtering to method in collection
  // method in triplist and return array with results if no search return all
  // $('#search-field').keypress(function (event) {
  //   // const value = inputElement.val();
  //   // const value = $(`#search-field input[name="query"]`);
  //   let input = document.getElementById("search-field");
  //   // let input = $('#search-field');
  //
  //
  //   // let filter = input.value.toLowerCase();
  //   let filter = input.value;
  //
  //
  //   let header = $(`#search-category select`).val();
  //
  //   // let results = trips.pluck(`${header}`).filter(word => word.match(`/${filter}/`));
  //   let results = trips.pluck(`${header}`).filter(word => word.match(`/Af/`));
  //   // let results = trips.pluck(`${header}`);
  //
  //
  //
  //   console.log(results);
  //   console.log('header');
  //
  //   console.log(header);
  //   // const letter = letters.val();
  //   console.log('filter');
  //
  //   console.log(filter);
  //   console.log(event.key);
  //   trips.textSearch(event.key);
  // });


});
