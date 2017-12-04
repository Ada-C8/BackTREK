// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';
import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/responsive-tables.css';
import './css/style.css';

import './responsive-tables';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

const allTrips = new TripList();
let filteredTrips = allTrips;

let tripListTemplate;
let tripTemplate;

// renders
const renderTripList = function renderTripList(tripList) {
  // empty existing list and res form
  const $tripList = $('#trip-list');
  $tripList.empty();
  $('#reservation').empty();

  tripList.forEach((trip) => {
    $tripList.append(tripListTemplate(trip.attributes));
  });
};

const renderTrip = function renderTrip(trip) {
  const $tripDetail = $('#trip-detail');

  $tripDetail.empty();
  $tripDetail.append(tripTemplate(trip.attributes))
  $('.reservation').append(loadResForm(trip.id));
};

const cancelSubmit = function cancelSubmit() {
  const $form = $(this).parent();
  $form.trigger('reset');
  $form.find('p').remove();
  $form.find('input').removeClass('error');
  // $(this).parent().trigger('reset');
  // $(this).parent().find('p').remove();
  // $('.error-messages').empty();
};

const readForm = function readForm(form) {
  const fields = form.find(':input').not('button');
  const formData = {};

  for (let i = 0; i < fields.length; i += 1) {
    const field = fields[i];
    formData[field.name] = $(`#${field.id}`).val();
  }

  return formData;
};

const readTripForm = function readTripForm() {
  const $tripForm = $('#add-trip-form');
  return readForm($tripForm);
};

const readResForm = function readResForm() {
  const $resForm = $('#add-res-form');
  const tripId = $resForm.data('id');
  const resData = readForm($resForm);

  resData['trip_id'] = tripId;

  return resData
}

const renderSuccess = function renderSuccess(message, section) {
  // const $msgSection = $('main > .status-messages')

  section.addClass('success');
  section.append(`<p>${message}</p>`);
  // $msgSection.delay(5000).fadeout();
}

const renderError = function renderError(field, error, form) {
  const html = `<p class="error-message small-6 cell">${error}</p>`;
  const $errorInput = form.find(`input[name=${field}]`);

  $errorInput.before(html);
  $errorInput.addClass('error');
};

const handleValidationErrors = function handleValidationErrors(errors, form) {
  Object.keys(errors).forEach((field) => {
    errors[field].forEach((error) => {
      renderError(field, error, form);
    });
  });
};

const getTrip = function getTrip(event) {
  const tripId = event.currentTarget.id;
  let trip = new Trip({id: tripId});

  trip.fetch({
    success: function(trip, response, options) {

      // render error if no content
      if (options.xhr.status === 204) {
        const html = '<h3>Trip Not Found</h3>';
        $('.detail.status-messages').append(html);
      } else {
        renderTrip(trip);
      }
    },
    // how is this handled???
    error: function(trip) {
      console.log(trip);
    }
  });
};

// const successfulSave = function successfulSave(trip) {
//   $('.error-messages').empty();
//
//   tripList.add(trip);
//   $.modal.close();
// };

const addTrip = function addTrip(event) {
  event.preventDefault();
  const trip = new Trip(readTripForm());

  // client side validations
  if (trip.isValid()) {
    trip.save({}, {
      success: () => {
        if ($('#add-trip-form p').length) {
          $('#add-trip-form p').remove();
        }

        allTrips.add(trip);
        $.modal.close();

        renderSuccess('Trip successfully added', $('main > .status-messages'));
      },
      // success: successfulSave,
      error: (model, response) => {
        handleValidationErrors(response.responseJSON.errors, $('#add-trip-form'));
      }
      // error: failedSave
    });
  } else {
    handleValidationErrors(trip.validationError, $('#add-trip-form'));
  }
};

const loadResForm = function loadTripForm(tripId) {
  const html = `
  <form id="add-res-form" data-id="${tripId}" action="https://ada-backtrek-api.herokuapp.com/trips/${tripId}/reservations" method="post">
    <section class="status-messages">
    </section>
    <div class="name grid-x">
      <label class="small-6 cell">Name</label>
      <input type="text" id="res-name" name="name" />
    </div>

    <div class="age grid-x">
      <label class="small-6 cell">Age</label>
      <input type="number" id="age" name="age" />
    </div>

    <div class="email grid-x">
      <label class="small-6 cell">Email</label>
      <input type="email" id="email" name="email" />
    </div>

    <button class="button confirm" type="submit" id="add-reservation">Reserve this Trip</button>
    <button class="button cancel" type="reset" id="cancel-reservation">Cancel</button>
  </form>`;

  $('.reservation').append(html);
};

const addRes = function addRes(event) {
  event.preventDefault();

  const res = new Reservation(readResForm());

  // client-side validations
  if (res.isValid()) {
    res.save({}, {
      success: () => {
        // if ($('#add-res-form p').length) {
          $('#add-res-form p').remove();
        // }
        renderSuccess('Spot reserved', $('#add-res-form .status-messages'));
        $('#add-res-form').trigger('reset');
      },
      error: (model, response) => {
        handleValidationErrors(response.responseJSON.errors, $('#add-res-form'));
      }
    });
  }
  else {
    handleValidationErrors(res.validationError, $('#add-res-form'));
  }
};

const sortTrips = function sortTrips() {
  const fields = ['id', 'name', 'continent', 'category', 'cost', 'weeks'];

  $('.current-sort-field').removeClass('current-sort-field');
  $(this).addClass('current-sort-field');

  const classes = $(this).attr('class').split(/\s+/);

  classes.forEach((className) => {
    // if already sorted, sort desc
    if (fields.includes(className)) {
      if (className === allTrips.comparator) {
        allTrips.models.reverse();
        allTrips.trigger('sort', allTrips);
        // sort asc
      } else {
        allTrips.comparator = className;
        allTrips.sort();
      }
    }
  });
};

const filterTrips = function filterTrips() {
  const $filter = $('#filter-by option:checked').val();
  // make empty string if undefined
  const $search = $('#search').val() || "";
  filteredTrips = allTrips.filterBy($filter, $search);
  renderTripList(filteredTrips);
};

const init = () => {
  $('body').removeClass('init');
  $('div.init').hide();
  $('header').addClass('grid-x');
  $('header').show();
  $('main').addClass('grid-x grid-padding-x')
  $('main').show();

  allTrips.fetch();
};

$(document).ready( () => {
  // load templates
  tripListTemplate = _.template($('#trip-list-template').html());
  tripTemplate = _.template($('#trip-template').html());

  $('.start').on('click', init);

  allTrips.on('update', renderTripList, allTrips);
  allTrips.on('sort', renderTripList, allTrips);
  // filteredTrips.on('update', renderTripList, filteredTrips);

  $('#trip-list').on('mouseover', 'tr', getTrip, this);
  $('.all-trips th').on('click', sortTrips);

  $('.cancel').on('click', cancelSubmit);
  $('#add-trip-form').on('submit', addTrip);

  $('#trip-detail').on('submit', '#add-res-form', addRes);
  $('#filter').on('change keyup', 'input, select', filterTrips);
  // $('#filter').on('change', 'select', filterTrips);

  // allTrips.fetch();
});
