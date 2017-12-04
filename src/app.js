// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/style.css';

// Import Trip Model and Collection
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

const tripFields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
const reservationFields = ['name', 'age', 'email'];

const events = {
  sortTrips(event){
    // TODO: tell the user that a sort has happened
    console.log('Tried to sort!');
    $('.sort').removeClass('current-sort-field');
    $(this).addClass('current-sort-field');
    let classes = $(this).attr('class').split(/\s+/);
    classes.forEach((className) => {
      if(tripFields.includes(className)){
        if (className === tripList.comparator){
          tripList.models.reverse();
          tripList.trigger('sort', tripList);
        } else {
          tripList.comparator = className;
          tripList.sort();
        }
      }
    });
  },
  filterTrips(event) {
    // TODO: handle no trip results gracefully
    const query = $('#trip-query').val().toLowerCase();
    const attr = $('#trip-fields').find(':selected').val();
    // name, category, continent needs .includes
    // weeks, cost needs less than
    const filteredTrips = tripList.filter((trip) => trip.get(attr).toLowerCase().includes(query));

    let $tripList = $('#trip-list');
    $tripList.empty();
    if (filteredTrips.length > 0) {
      filteredTrips.forEach((trip) => {
        $tripList.append(allTripsTemplate(trip.attributes));
      });
    } else {
      $tripList.append('<h1>No Trips Fit Criteria =(</h1>');
    }
  },
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
    $('.status-title').empty();
    $('.status-messages section ul').empty();
    $('.status-messages').hide();
    $.modal.close();
  },
  showModal(){
    console.log('show modal!');
    $('#create-trip-modal').show();
  },
  addTrip(event){
    event.preventDefault();
    const tripData = {};
    tripFields.forEach( (field) => {
      const val = $(`#create-trip-form input[name=${field}]`).val();
      if (val != '') tripData[field] = val;
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
      events.addStatusMessagesFromHash('#modal-status-messages', 'errors', trip.validationError);
    }
  },
  successfulSaveTrip(trip, response){
    console.log('in successfulSaveTrip');
    $('#create-trip-form .input').val('');
    events.hideModal();
    tripList.add(trip);
    events.addStatusMessagesFromHash('#page-status-messages', 'success', {message: 'Trip has been successfully added'});
  },
  failSaveTrip(trip, response){
    console.log('inside failSaveTrip');
    console.log('Response Validation Errors');
    console.log(response);
    events.addStatusMessagesFromHash('#modal-status-messages', 'errors', response.responseJSON.errors);
    trip.destroy();
  },
  addStatusMessagesFromHash(jquerySelector, statusTitle, collection){
    // $tripList.append(allTripsTemplate(trip.attributes));
    let tripAttributes = collection;
    tripAttributes['status'] = statusTitle;
    console.log('Trip Attributes');
    console.log(tripAttributes);
    $('.status-title').empty();
    $(jquerySelector).empty();
    console.log('inside addStatusMessagesFromHash method');
    $(jquerySelector).append(statusMessageTemplate({trip: tripAttributes}));
    if (statusTitle === 'success'){
      $(jquerySelector).show().delay(3000).fadeOut();
    } else {
      $(jquerySelector).show();
    }
  },
  addReservation(event){
    event.preventDefault();
    console.log('submitted a reservation!');
    const reservationData = {};
    reservationFields.forEach( (field) => {
      // needs the #id attribute
      const val = $(`#create-reservation-form input[name=${field}]`).val();
      if (val != '') reservationData[field] = val;
    });
    console.log(reservationData);
    const reservation = new Reservation(reservationData);
    if (reservation.isValid()) {
      const tripID = $(this).data('id');
      reservation.urlRoot = `${(new Trip()).urlRoot}${tripID}/reservations`;
      reservation.save({}, {
        success: events.successfulSaveReservation,
        error: events.failSaveReservation,
      });
    } else { // save is invalid
      console.log('Reservation Validation Error');
      console.log(reservation.validationError);
      // events.addStatusMessagesFromHash('Errors', reservation.validationError);
      events.addStatusMessagesFromHash('#reservation-status-messages', 'errors', reservation.validationError);
    }
  },
  successfulSaveReservation(reservation, response){
    // TODO: add confirmation message in trip-details somewhere
    $('#create-reservation-form .input').val('');
    events.addStatusMessagesFromHash('#reservation-status-messages', 'success', {message: 'Reservation has been successfully added'});
    console.log('successfully saved a resrevation');
  },
  failSaveReservation(reservation, response){
    console.log('Response Validation Errors');
    console.log(response.responseJSON.errors);
    events.addStatusMessagesFromHash('#reservation-status-messages', 'errors', reservation.validationError);
    reservation.destroy();
  },
  emptyModalMessages(){
    $('#modal-status-messages').empty();
  }
}


// TEMPLATE RENDERING
const tripList = new TripList();
let allTripsTemplate;
let tripDetailsTemplate;
let statusMessageTemplate;

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
  statusMessageTemplate = _.template($('#status-message-template').html());

  // render template for all trips
  tripList.on('update', render, tripList);
  tripList.on('sort', render);
  tripList.fetch();

  // render template for trip details (on click)
  $('#trip-list').on('click', '.trip', events.fetchTrip);

  // render modal for adding a trip
  $('#create-trip-btn').click(events.showModal);
  $('.close').click(events.hideModal);

  // submit forms
  $('#create-trip-form').submit(events.addTrip);
  $(document).on('submit', '#create-reservation-form', events.addReservation);

  // sort trips
  $('.sort').click(events.sortTrips);

  // filter trips
  $('#trip-query').keyup(events.filterTrips);
  $('#trip-fields').change(events.filterTrips);

  // empty modal messages
  $('#create-trip-modal').click(events.emptyModalMessages);
});
