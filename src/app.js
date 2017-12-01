// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

// Import Trip Model and Collection
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const tripFields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
const reservationFields = ['name', 'age', 'email'];

const events = {
  fetchTrip() {
    const trip = tripList.get($(this).data('id'));
    trip.fetch({
      success: events.successfulTripFetch,
      error: events.failedTripFetch,
    });
  },
  successfulTripFetch(trip) {
    let $tripDetails = $('#trip-details');
    $tripDetails.empty();
    $tripDetails.append(tripDetailsTemplate(trip.attributes));
  },
  failedTripFetch() {
    console.log('failed trip fetch');
  },
  hideModal(){
    // TODO: click out of the modal and close
    console.log('hid modal!');
    // clear error messages
    $('#status-title').empty();
    $('#status-messages ul').empty();
    $('#status-messages').hide();

    $('#create-trip-modal').hide();
  },
  showModal(){
    console.log('show modal!');
    $('#create-trip-modal').show();
  },
  addTrip(event){
    event.preventDefault();
    const tripData = {};
    tripFields.forEach( (field) => {
      const val = $(`input[name=${field}]`).val();
      // TODO: check for validation if an input has a value
      if (val != '') {
        tripData[field] = val;
      }
    });
    console.log('in addTrip in app.js');
    console.log(tripData);

    const trip = new Trip(tripData);
    if (trip.isValid()) {
      console.log('it is valid!');
      trip.save({}, {
        success: events.successfulSaveTrip,
        error: events.failSaveTrip
      });
    } else { // save is invalid
      console.log('Trip Validation Error');
      console.log(trip.validationError);
      events.addStatusMessagesFromHash("Error", trip.validationError);
    }
  },
  successfulSaveTrip(trip, response){
    // TODO: add message
    $('#create-trip-form .input').val("");
    events.hideModal();
    tripList.add(trip);
  },
  failSaveTrip(trip, response){
    $('#status-title').text('Errors:');
    console.log('Response Validation Errors');
    console.log(response);
    events.addStatusMessagesFromHash("Error", response.responseJSON.errors);
    trip.destroy();
  },
  addStatusMessagesFromHash(statusTitle, collection){
    console.log('Collection');
    console.log(collection);
    $('#status-title').empty();
    $('#status-messages ul').empty();

    $('#status-title').text(`${statusTitle}`);
    for (let key in collection) {

      $('#status-messages ul').append(`<li>${key}: ${collection[key]}</li>`);
    }
    $('#status-messages').css('background-color', 'pink');
    $('#status-messages').show();
  }
}


// TEMPLATE RENDERING
const tripList = new TripList();
let allTripsTemplate;
let tripDetailsTemplate;

const render = function render(tripList) {
  let $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append(allTripsTemplate(trip.attributes));
  });
  console.log('rendered it');
};

$(document).ready( () => {
  // TEMPLATES
  allTripsTemplate = _.template($('#all-trips-template').html());
  tripDetailsTemplate = _.template($('#trip-details-template').html());

  // render template for all trips
  tripList.on('update', render, tripList);
  tripList.fetch();

  // render template for trip details (on click)
  $('#trip-list').on('click', '.trip', events.fetchTrip);

  // render modal for adding a trip
  $('#create-trip-btn').click(events.showModal);
  $('.close').click(events.hideModal);

  //submit forms
  $('#create-trip-form').submit(events.addTrip);
  // $('#create-reservation-form').submit(events.addReservation);
});
