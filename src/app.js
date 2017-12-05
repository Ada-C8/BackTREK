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
    let query = $('#trip-query').val().toLowerCase();
    const attr = $('#trip-fields').find(':selected').val();
    let filteredTrips;
    if (query !== ''){
      if(attr === 'name' || attr === 'category' || attr === 'continent') {
        filteredTrips = tripList.filter((trip) => trip.get(attr).toLowerCase().includes(query));
      } else {
        if (isNaN(parseInt(query))) {
          query = '0';
        }
        filteredTrips = tripList.filter((trip) => parseInt(trip.get(attr)) <= parseInt(query));
      }
      let $tripList = $('#trip-list');
      $tripList.empty();
      if (filteredTrips && filteredTrips.length > 0) {
        filteredTrips.forEach((trip) => {
          $tripList.append(allTripsTemplate(trip.attributes));
        });
      } else {
        $tripList.append('<h1>No Trips Fit The Criteria =(</h1>');
      }
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
  failedTripFetch(response) {
    events.addStatusMessagesFromHash('#page-status-messages', 'error', response.responseJSON.errors);
  },
  hideModal(){
    $('.status-title').empty();
    $('.status-messages section ul').empty();
    $('.status-messages').hide();
    $.modal.close();
  },
  addTrip(event){
    event.preventDefault();
    const tripData = {};
    tripFields.forEach( (field) => {
      const val = $(`#create-trip-form input[name=${field}]`).val();
      if (val != '') tripData[field] = val;
    });
    const trip = new Trip(tripData);
    if (trip.isValid()) {
      trip.save({}, {
        success: events.successfulSaveTrip,
        error: events.failSaveTrip
      });
    } else { // save is invalid
      events.addStatusMessagesFromHash('#modal-status-messages', 'errors', trip.validationError);
    }
  },
  successfulSaveTrip(trip, response){
    $('#create-trip-form .input').val('');
    events.hideModal();
    tripList.add(trip);
    events.addStatusMessagesFromHash('#page-status-messages', 'success', {message: 'Trip has been successfully added'});
  },
  failSaveTrip(trip, response){
    events.addStatusMessagesFromHash('#modal-status-messages', 'errors', response.responseJSON.errors);
    trip.destroy();
  },
  addStatusMessagesFromHash(jquerySelector, statusTitle, collection){
    let tripAttributes = collection;
    tripAttributes['status'] = statusTitle;
    $('.status-title').empty();
    $(jquerySelector).empty();
    $(jquerySelector).append(statusMessageTemplate({trip: tripAttributes}));
    if (statusTitle === 'success'){
      $(jquerySelector).show().delay(3000).fadeOut();
    } else {
      $(jquerySelector).show();
    }
  },
  addReservation(event){
    event.preventDefault();
    const reservationData = {};
    reservationFields.forEach( (field) => {
      const val = $(`#create-reservation-form input[name=${field}]`).val();
      if (val != '') reservationData[field] = val;
    });
    const reservation = new Reservation(reservationData);
    if (reservation.isValid()) {
      const tripID = $(this).data('id');
      reservation.urlRoot = `${(new Trip()).urlRoot}${tripID}/reservations`;
      reservation.save({}, {
        success: events.successfulSaveReservation,
        error: events.failSaveReservation,
      });
    } else { // save is invalid
      events.addStatusMessagesFromHash('#reservation-status-messages', 'errors', reservation.validationError);
    }
  },
  successfulSaveReservation(reservation, response){
    $('#create-reservation-form .input').val('');
    events.addStatusMessagesFromHash('#reservation-status-messages', 'success', {message: 'Reservation has been successfully added'});
  },
  failSaveReservation(reservation, response){
    events.addStatusMessagesFromHash('#reservation-status-messages', 'errors', reservation.validationError);
    reservation.destroy();
  },
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

  // submit forms
  $('#create-trip-form').submit(events.addTrip);
  $(document).on('submit', '#create-reservation-form', events.addReservation);

  // sort trips
  $('.sort').click(events.sortTrips);

  // filter trips
  $('#trip-query').keyup(events.filterTrips);
  $('#trip-fields').change(events.filterTrips);
});
