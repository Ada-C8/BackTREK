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
  list.forEach((trip) => $('#all-trips').append(allTripsTemplate(trip.attributes)));
};

const loadTripsTable = function loadTripsTable(list) {
  $('#trip-headers').html('');
  clearContent();
  tableFields.forEach((field) => $('#trip-headers').append(tripHeadersTemplate({header: field})));
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

const setFilterCategory = function setFilterCategory() {
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
      filteredTrips = tripList.models.filter(trip => trip.attributes[filterCategory].toLowerCase().includes(filterInput));
      referenceList.reset(filteredTrips);
      renderTrips(referenceList);
      break;
    case 'weeks':
    case 'cost':
      filterInput = parseFloat(filterInput);
      filteredTrips = tripList.models.filter(trip => trip.attributes[filterCategory] <= filterInput);
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
  $('#show-trip').addClass('show-right').siblings().removeClass('show-right');
  highlightCurrentTrip(event);
  clearContent();
  splitScreen();
  const tripUrl = `${url}/${event.currentTarget.id}`;
  $.get(tripUrl, (response) => {
    response.plural = (response.weeks === 1) ? '' : 's';
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

const loadFormFields = function loadFormFields(formId, formFieldsArray) {
  clearContent();
  formFieldsArray.forEach((item) => {
    $(`#${formId}`).append(formTemplate({field: item}));
  });
  $(`#${formId}`).append('<section><button type="submit" class="button">Submit</button></section>');
}

const addTripForm = function addTripForm() {
  loadFormFields('add-trip-form', addTripFields);
  $('#add-trip-header').append('Add Trip');
}

const saveTrip = function saveTrip(event) {
  event.preventDefault();
  const data = {};
  addTripFields.forEach((field) => data[field] = $(`#add-trip-form input[name=${field}]`).val());
  const trip = new Trip(data);
  if (trip.isValid()) {
    trip.save({}, {
      success: successfulTripSave,
      error: failedTripSave,
    })
  } else {
    displayFormErrors('add-trip-form', trip.validationError)
  }
}

const displayFormErrors = function displayFormErrors(formId, errors) {
  $(`#${formId} input`).removeClass('input-error');
  $(`#${formId} label span`).empty();
  for (let error in errors) {
    errors[error].forEach((message) => {
      $(`#${formId} label span#label-${error}`).append(`: ${message}`);
    });
    $(`#${formId} input#${error}`).addClass('input-error');
  }
}

const displayStatusMessages = function displayStatusMessages(model) {
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`<li>${model.get('name')} added!</li>`);
  $('#status-messages').show();
};

const successfulTripSave = function successfulTripSave(trip) {
  $.modal.close();
  tripList.add(trip);
  referenceList.add(trip);
  addTripFields.forEach((field) => {
    $(`#add-trip-form input[name=${field}]`).val('');
  });
  displayStatusMessages(trip);
}

const failedTripSave = function failedTripSave(model, response) {
  model.destroy
  displayFormErrors('add-trip-form', response.responseJSON.errors);
}

const reserveForm = function reserveForm(event) {
  loadFormFields('reserve-trip-form', reservationFields);
  $('#reserve-trip-header').append('Reserve');
  $('#reserve-trip-form').attr('tripid', $(event.currentTarget.attributes.tripid).val());
};

const saveReservation = function saveReservation(event) {
  event.preventDefault();
  const tripId = $(event.currentTarget.attributes.tripid).val();
  const data = {};
  reservationFields.forEach((field) => data[field] = $(`#reserve-trip-form input[name=${field}]`).val());
  const reservation = new Reservation(data, {trip: tripId});
  if (reservation.isValid()) {
    reservation.save({}, {
      success: successfulReservationSave,
      error: failedReservationSave,
    })
  } else {
    displayFormErrors('reserve-trip-form', reservation.validationError);
  }
}

const successfulReservationSave = function successfulReservationSave(reservation, response) {
  reservationFields.forEach((field) => $(`#reserve-trip-form input[name=${field}]`).val(''));
  displayStatusMessages(reservation);
  const fakeEvent = {currentTarget: {id: response.trip_id}};
  showTrip(fakeEvent);
}

const failedReservationSave = function failedReservationSave(model, response) {
  model.destroy
  displayFormErrors('reserve-trip-form', response.responseJSON.errors);
}

const sortTrips = function sortTrips() {
  const classes = $(this).attr('class').split(/\s+/);
  referenceList.comparator = classes.find(thisClass => tableFields.includes(thisClass));
  $('.sortorder').empty();
  if (classes.includes('desc')) {
    renderTrips(referenceList.models.reverse());
    $(this).removeClass('desc');
  } else {
    renderTrips(referenceList.sort());
    $(this).addClass('desc').siblings().removeClass('desc');
  }
  $(`.${referenceList.comparator} .sortorder`).html($(this).hasClass('desc') ? '&#x25BC': '&#x25B2');
  $(this).addClass('current-sort-field').siblings().removeClass('current-sort-field');
}

$(document).ready( () => {
  allTripsTemplate = _.template($('#all-trips-template').html());
  tripHeadersTemplate = _.template($('#trip-headers-template').html());
  showTripTemplate = _.template($('#show-trip-template').html());
  formTemplate = _.template($('#form-template').html());
  filterTemplate = _.template($('#filter-trips-template').html());
  $('#load-trips').on('click', function() {
    unSplitScreen();
    fetchTrips();
    loadTripsTable(referenceList);
  });
  tripList.on('update', syncReferenceList);
  referenceList.on('update', loadTripsTable, referenceList);
  $('#filter-select').on('change', setFilterCategory);
  $('#filter-input').on('input', filterTrips);
  $('#all-trips').on('click', '.trip', showTrip);
  $('thead').on('click', '.sort', sortTrips);
  $('#add-trip').on('click', addTripForm);
  $('#add-trip-form').on('submit', saveTrip);
  $('#show-trip').on('click', '#reserve', reserveForm);
  $('#reserve-trip-form').on('submit', saveReservation);
  $('.clear, #load-trips, #add-trip').on('click', clearMessages);
});
