// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/style.css';

// Models and Collections
import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

const tripList = new TripList();
let referenceList = new TripList();
let allTripsTemplate;
let tripHeadersTemplate;
let showTripTemplate;
let formTemplate;
let filterTemplate;
let filterCategory;

const url = 'https://ada-backtrek-api.herokuapp.com/trips';
const tableFields = ['name', 'category', 'continent', 'weeks', 'cost'];
const addTripFields = ['name', 'category', 'continent', 'weeks', 'cost', 'about'];
const reservationFields = ['name', 'age', 'email'];

const fetchTrips = function fetchTrips() {
  tripList.fetch();
}

const syncReferenceList = function syncReferenceList() {
  referenceList.add(tripList.models);
  loadTripsTable(referenceList);
}

const renderTrips = function renderTrips(list) {
  $('#all-trips').empty();
  list.forEach((trip) => {
    $('#all-trips').append(allTripsTemplate(trip.attributes));
  });
};

const loadTripsTable = function loadTripsTable(list) {
  $('#trip-headers').html('');
  clearContent();
  tableFields.forEach((field) => {
    $('#trip-headers').append(tripHeadersTemplate({header: field}))
  });
  renderTrips(list);
  loadFilters();
};

const loadFilters = function loadFilters() {
  $('#filter-select').empty();
  $('#filter').show();
  tableFields.forEach((filter) => {
    const capitalFilter = filter.charAt(0).toUpperCase() + filter.slice(1);
    $('#filter-select').append(filterTemplate({item: filter, capitalized: capitalFilter}))
  });
  $('#filter-select').prop('selectedIndex', -1);
};

const setfilterCategory = function setfilterCategory() {
  const capital = $('#filter-select').find(':selected').text();
  filterCategory = capital.charAt(0).toLowerCase() + capital.slice(1);
};

const filterTrips = function filterTrips(event) {
  let filterInput = event.currentTarget.value;
  let filteredTrips = [];
  switch (filterCategory) {
    case 'name':
    case 'category':
    case 'continent':
      filterInput = filterInput.toLowerCase();
      filteredTrips = tripList.models.filter(function(trip) {
        return trip.attributes[filterCategory].toLowerCase().includes(filterInput);
      });
      referenceList.reset(filteredTrips);
      renderTrips(referenceList);
      break;
    case 'weeks':
    case 'cost':
      filterInput = parseFloat(filterInput);
      filteredTrips = tripList.models.filter(function(trip) {
        return trip.attributes[filterCategory] <= filterInput;
      });
      referenceList.reset(filteredTrips);
      renderTrips(referenceList);
      break;
    default:
      break;
  }
};

const splitScreen = function splitScreen() {
  $('.left-half').addClass('columns small-6 float-left');
  $('.right-half').addClass('columns small-6 float-right');
};

const unSplitScreen = function unSplitScreen() {
  $('.left-half, .right-half').removeClass('columns small-6 float-left');
  $('#filter-input').val('');
}

const highlightCurrentTrip = function highlightCurrentTrip(event) {
  const currentRow = $(event.currentTarget).parent().parents('tr:first').children();
  $('#all-trips tr td').removeClass('current-trip');
  $(currentRow).addClass('current-trip');
};

const showTrip = function showTrip(event) {
  $('#show-trip').addClass('show-right');
  $('#show-trip').siblings().removeClass('show-right');
  highlightCurrentTrip(event);
  clearContent();
  splitScreen();
  const tripId = event.currentTarget.id;
  const tripUrl = `${url}/${tripId}`;
  $.get(tripUrl, (response) => {
    if (response.weeks === 1) {
      response.plural = ''
    } else {
      response.plural = 's'
    }
    $('#show-trip').append(showTripTemplate(response));
  })
};

const clearContent = function clearContent() {
  $('.content').empty();
};

const clearMessages = function clearMessages() {
  $('#status-messages ul').empty();
  $('#status-messages').hide();
};

const addTripForm = function addTripForm() {
  clearContent();
  $('#add-trip-header').append('Add Trip');
  addTripFields.forEach((item) => {
    $('#add-trip-form').append(formTemplate({field: item}));
  });
  $('#add-trip-form').append('<section><button type="submit" class="button">Submit</button></section>');
}

const saveTrip = function saveTrip(event) {
  event.preventDefault();
  const tripData = {};
  addTripFields.forEach((field) => {
    tripData[field] = $(`#add-trip-form input[name=${field}]`).val();
  });
  const trip = new Trip(tripData);
  if (trip.isValid()) {
    trip.save({}, {
      success: successfulTripSave,
      error: failedTripSave,
    })
  } else {
    $('#add-trip-form input').removeClass('input-error');
    $('#add-trip-form label span').empty();
    for (let error in trip.validationError) {
      trip.validationError[error].forEach((message) => {
        $(`#add-trip-form label span#label-${error}`).append(`: ${message}`);
      });
      $(`#add-trip-form input#${error}`).addClass('input-error');
    }
  }
}

const successfulTripSave = function successfulTripSave(trip) {
  $.modal.close();
  tripList.add(trip);
  referenceList.add(trip);
  addTripFields.forEach((field) => {
    $(`#add-trip-form input[name=${field}]`).val('');
  });
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`);
  $('#status-messages').show();
}

const failedTripSave = function failedTripSave(model, response) {
  model.destroy
  $('#status-messages ul').empty();
  const errors = response.responseJSON.errors;
  for (let key in errors) {
    errors[key].forEach((issue) => {
      $('#status-messages ul').append(`<li>${key}: ${issue}</li>`);
    })
  }
  $('#status-messages').show();
}

const reserveForm = function reserveForm(event) {
  clearContent();
  $('#reserve-header').append('Reserve');
  const tripId = $(event.currentTarget.attributes.tripid).val();
  $('#reserve-trip-form').attr('tripid', tripId);
  reservationFields.forEach((item) => {
    $('#reserve-trip-form').append(formTemplate({field: item, lowercaseField: item}));
  });
  $('#reserve-trip-form').append('<section><button type="submit" class="button">Submit</button></section></form>');
};

const saveReservation = function saveReservation(event) {
  event.preventDefault();
  const baseUrl = 'https://ada-backtrek-api.herokuapp.com/trips';
  const tripId = $(event.currentTarget.attributes.tripid).val();
  const finalUrl = `${baseUrl}/${tripId}/reservations`
  const reservationData = {};
  reservationFields.forEach((field) => {
    reservationData[field] = $(`#reserve-trip-form input[name=${field}]`).val();
  });
  const reservation = new Reservation(reservationData, {url: finalUrl});
  if (reservation.isValid()) {
    reservation.save({}, {
      success: successfulReservationSave,
      error: failedReservationSave,
    })
  } else {
    $('#status-messages ul').empty();
      for (let error in reservation.validationError) {
        reservation.validationError[error].forEach((message) => $('#status-messages ul').append(`<li>${message}</li>`));
      }
      $('#status-messages').show();
  }
}

const successfulReservationSave = function successfulReservationSave(reservation, response) {
  reservationFields.forEach((field) => {
    $(`#reserve-trip-form input[name=${field}]`).val('');
  });
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`<li>A space reserved for ${reservation.get('name')}!</li>`);
  $('#status-messages').show();
  const fakeEvent = {currentTarget: {id: response.trip_id}};
  showTrip(fakeEvent);
}

const failedReservationSave = function failedReservationSave(model, response) {
  model.destroy
  $('#status-messages ul').empty();
  const errors = response.responseJSON.errors;
  for (let key in errors) {
    errors[key].forEach((issue) => {
      $('#status-messages ul').append(`<li>${key}: ${issue}</li>`);
    })
  }
  $('#status-messages').show();
}

const sortTrips = function sortTrips() {
  const classes = $(this).attr('class').split(/\s+/);
  let sortClass;
  for (let i = 0; i < classes.length && sortClass === undefined; i += 1) {
    if (tableFields.includes(classes[i])) {
      sortClass = classes[i];
    }
  }
  referenceList.comparator = sortClass;
  $('.sortorder').empty();
  if (classes.includes('desc')) {
    const descModels = referenceList.models.reverse();
    renderTrips(descModels);
    $(this).removeClass('desc');
    $(`.${sortClass} .sortorder`).html('&#x25B2');
  } else {
    referenceList.sort();
    $(this).addClass('desc').siblings().removeClass('desc');
    renderTrips(referenceList);
    $(`.${sortClass} .sortorder`).html('&#x25BC');
  }
  $(this).addClass('current-sort-field').siblings().removeClass('current-sort-field');
}

$(document).ready( () => {
  allTripsTemplate = _.template($('#all-trips-template').html());
  tripHeadersTemplate = _.template($('#trip-headers-template').html());
  showTripTemplate = _.template($('#show-trip-template').html());
  formTemplate = _.template($('#form-template').html());
  filterTemplate = _.template($('#filter-trips-template').html());
  $('#load-trips').on('click', unSplitScreen);
  $('#load-trips').on('click', fetchTrips);
  $('#load-trips').on('click', loadTripsTable, referenceList);
  tripList.on('update', syncReferenceList);
  referenceList.on('update', loadTripsTable, referenceList);
  $('#filter-select').on('change', setfilterCategory);
  $('#filter-input').on('input', filterTrips);
  $('#all-trips').on('click', '.trip', showTrip);
  $('thead').on('click', '.sort', sortTrips);
  $('#add-trip').on('click', addTripForm);
  $('#add-trip-form').on('submit', saveTrip);
  $('#show-trip').on('click', '#reserve', reserveForm);
  $('#reserve-trip-form').on('submit', saveReservation);
  $('.clear, #load-trips, #add-trip').on('click', clearMessages);
});
