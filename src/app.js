// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
//import './css/foundation.css';
//import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

// Vars that need to be defined up front
let tripRowTemplate;
let tripDetailsTemplate;
let trip = new Trip();
const tripList = new TripList();
const tripFields = ['name', 'category', 'continent', 'weeks', 'cost', 'about'];
const reservationFields = ['name', 'age', 'email'];

// Callback functions
const render = function render(tripList) {
  $('#trip-list').empty();
  tripList.forEach((trip) => {
    $('#trip-list').append(tripRowTemplate(trip.attributes));
  });
};

const getTrip = function getTrip() {
  const id = $(this).attr('id');
  trip = tripList.get(id);
  trip.fetch({success: events.successfulGetTrip, error: events.failedGetTrip});
};

const getTripList = function getTripList() {
  tripList.fetch({success: events.successfulGetTripList, error: events.failedGetTripList});
};

const showModal = function showModal() {
  $('#add-form-modal').show();
};

const hideModal = function hideModal() {
  $('#add-form-modal').hide();
  $('#add-trip-form').trigger('reset');
  $('#add-form-status-message').hide();
}

const events = {
  successfulGetTrip(trip) {
    $('#trip-not-found').hide();
    $('#trip-info').empty();
    $('#trip-info').append(tripDetailsTemplate(trip.attributes));
  },
  failedGetTrip() {
    $('#trip-not-found').show();
  },
  successfulGetTripList() {
    $('#list-not-found').hide();
    $('#trip-table').show();
  },
  failedGetTripList() {
    $('#list-not-found').show();
  },
  sortTrips(event) {
    const sortingBy = $(this).attr('class').split(' ');
    $('.sort').removeClass('current-sort-field');
    $(this).addClass('current-sort-field');
    if (sortingBy[1] === tripList.comparator) {
      tripList.models.reverse();
      tripList.trigger('sort', tripList);
    } else {
      tripList.comparator = sortingBy[1];
      tripList.sort();
    }
  },
  addTrip(event) {
    event.preventDefault();
    $('#add-form-status-message').hide();
    const tripData = {};
    tripFields.forEach((field) => {
      const value = $(`input[name=${field}]`).val();
      if (value != '') {
        tripData[field] = value;
      }
    })
    const trip = new Trip(tripData);
    if (trip.isValid()) {
      trip.save({}, {success: events.successfulTripSave, error: events.failedTripSave});
    } else {
      $('#add-form-status-message ul').empty();
      for(let key in trip.validationError) {
        trip.validationError[key].forEach((error) => {
          $('#add-form-status-message ul').append(`<li>${key}: ${error}</li>`);
        })
      }
      $('#add-form-status-message').show();
    }
  },
  successfulTripSave(trip) {
    $('#status-message h3').empty();
    $('#status-message h3').append(`${trip.get('name')} added!`);
    $('#status-message').show();
    setTimeout(function() {
      $('#status-message').hide();
    }, 3000);
    tripList.add(trip);
    $('#add-form-modal').hide();
    $('#add-trip-form').trigger('reset');
  },
  failedTripSave(trip, response) {
    $('#add-form-status-message ul').empty();
    for(let key in response.responseJSON.errors) {
      response.responseJSON.errors[key].forEach((error) => {
        $('#add-form-status-message ul').append(`<li>${key}: ${error}</li>`);
      })
    }
    $('#add-form-status-message').show();
  },
  reserveTrip(event) {
    event.preventDefault();
    $('#reserve-form-status-message').hide();
    const reservationData = {};
    reservationFields.forEach((field) => {
      const value = $(`#reserve-trip-form input[name=${field}]`).val();
      if (value != '') {
        reservationData[field] = value;
      }
    })
    const reservation = new Reservation(reservationData);
    reservation.urlRoot = $(event.target).attr('action');
    if (reservation.isValid()) {
      reservation.save({}, {success: events.successfulResSave, error: events.failedResSave});
    } else {
      $('#reserve-form-status-message ul').empty();
      for(let key in reservation.validationError) {
        reservation.validationError[key].forEach((error) => {
          $('#reserve-form-status-message ul').append(`<li>${key}: ${error}</li>`);
        })
      }
      $('#reserve-form-status-message').show();
    }
  },
  successfulResSave(reservation) {
    $('#status-message h3').empty();
    $('#status-message h3').append(`Pack your bags! Successfully reserved a spot for ${reservation.get('name')} on the ${tripList.get(reservation.get('trip_id')).get('name')} trip!`);
    $('#status-message').show();
    $('#reserve-trip-form').trigger('reset');
    setTimeout(function() {
      $('#status-message').hide();
    }, 3000);
  },
  failedResSave(reservation, response) {
    $('#reserve-form-status-message ul').empty();
    for(let key in response.responseJSON.errors) {
      response.responseJSON.errors[key].forEach((error) => {
        $('#reserve-form-status-message ul').append(`<li>${key}: ${error}</li>`);
      })
    }
    $('#reserve-form-status-message').show();
  }
};


$(document).ready( () => {
  tripRowTemplate = _.template($('#trip-row-template').html());
  tripDetailsTemplate = _.template($('#trip-details-template').html());

  // Listeners for fetching, sorting and rendering data
  tripList.on('update', render, tripList)
  tripList.on('sort', render, tripList)
  $('#explore-trips').on('click', getTripList);
  $('.sort').click(events.sortTrips)
  $('#trip-list').on('click', 'tr', getTrip);

  // Listeners for modal add trip form
  $('#add-trip').on('click', showModal);
  $('#add-form-modal').on('click', hideModal);
  $(':button').on('click', hideModal);
  $('#add-modal-content').click(function(e){ e.stopPropagation();});

  // Listeners for posting data
  $('#add-trip-form').submit(events.addTrip);
  $('#trip-info').on('submit', '#reserve-trip-form', events.reserveTrip);
});
