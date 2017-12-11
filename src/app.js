// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

let tripList;
let tripTemplate;
let tripDetailsTemplate;

console.log('it loaded!');

const render = function render(tripList) {
  const tripListElement = $('#trip-list');
  tripListElement.empty();

  tripList.forEach((trip) => {
    tripListElement.append(tripTemplate(trip.attributes));
  });
};

const failLoad = function failLoad(model, response) {
  updateStatusMessageFrom(response.responseJSON.errors);
};

const loadTrips = function loadTrips() {
  tripList.fetch();
  tripList.on('update', render, tripList);
  $('#trips').show();
};

const sortTrips = function sortTrips(event) {
  $('.current-sort-field').removeClass('current-sort-field');
  $(this).addClass('current-sort-field');

  const classes = $(this).attr('class').split(/\s+/);

  classes.forEach((className) => {
    if (TRIP_FIELDS.includes(className)) {
      if (className === tripList.comparator) {
        tripList.models.reverse();
        tripList.trigger('sort', tripList);
      } else {
        tripList.comparator = className;
        tripList.sort();
      }
    }
  });
};

const addTrip = function addTrip(event) {
  event.preventDefault();

  const tripData = readForm();
  const trip = new Trip(tripData);
  if (trip.isValid()) {
    trip.save({}, {
      success: successfulSave,
      error: failedSave,
    });
  } else {
    updateStatusMessageFrom(trip.validationError);
  }
};

const readForm = function readForm() {
  const tripData = {};
  TRIP_FIELDS.forEach((field) => {
    const inputElement = $(`#new-trip input[name="${ field }"]`);
    tripData[field] = inputElement.val();
  });
  return tripData;
};

const clearForm = function clearForm() {
  $('#new-trip input[name]').val('');
};

const clearFilter = function clearFilter() {
  $('#filters input').val('');
  $('#filters option').prop('selected', function() {
    return this.defaultSelected;
  });
};

const updateStatusMessageFrom = (messageHash) => {
  $('span.error').empty();
  for (let messageType in messageHash) {
    messageHash[messageType].forEach((message) => {
      $(`#new-trip label[for="${ messageType }"]`).append(`  <span>${ message }</span>`);
    });
  }
};

const updateStatusMessagesWith = (message) => {
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`<li>${ message }</li>`);
  $('#status-messages').show();
};

const successfulSave = function(trip, response) {
  updateStatusMessagesWith(`${trip.get('name')} added!`)
  clearForm();
  $('#add-trip').css("display", "none");
  tripList.fetch();
};

const failedSave = function(trip, response) {
  updateStatusMessageFrom(response.responseJSON.errors);
  trip.destroy();
};

const loadTrip = function loadTrip(trip) {
  $('#trip').empty();
  $('#trip').addClass('green-border');
  $('#trip').append(tripDetailsTemplate(trip.attributes));
  $('#reservation').hide();
  $('#trip').on('click', 'button', function() {
    $('#reservation').slideToggle();
  });

  $('#reservation').submit(function(e) {
    e.preventDefault();

    const url = $(this).attr('action')
    const formData = $(this).serialize();

    if ($('#cust-name').val() === '' || $('#email').val() === '') {
      $('#reservation span').remove();
      $('#reservation').slideToggle();
      if ($('#cust-name').val() === '') {
        console.log('appending name error');
        console.log($('#name').val());
        $(`#reservation label[for="name"]`).append(`  <span>Cannot be blank</span>`);
      }
      if ($('#email').val() === '') {
        console.log('appending email error');
        $(`#reservation label[for="email"]`).append(`  <span>Cannot be blank</span>`);
      }
      console.log('before hide');
    } else {
      $.post(url, formData, (response) => {
        $('#message').html('<p>Spot reserved!</p>');
        $('#reservation').hide();
        console.log('after hide');
        clearForm();
      }).fail(() => {
        $('#message').html('<p>Reservation failed to save.</p>');
      });
    }
  });
};

$(document).ready( () => {
  $('#trips').hide();
  clearFilter();
  tripTemplate = _.template($('#trip-template').html());
  tripDetailsTemplate = _.template($('#trip-details-template').html());

  tripList = new TripList();

  tripList.on('update', render, tripList);
  tripList.on('sort', render, tripList);

  $('button#search').on('click', loadTrips);
  $('#filters input').on('keyup', function() {
    const query = $(this).val().toLowerCase();
    const filterCategory = $('#filters select').val().toLowerCase();
    const filteredList = tripList.filterBy(filterCategory, query);
    if (filteredList.length === 0) {
      $('#trips').append('<p>No trips match your search</p>');
    } else {
      render(filteredList);
    }
  });

  $('.sort').click(sortTrips);
  $('#new-trip').on('submit', addTrip);

  $('#trip-list').on('click', 'tr', function() {
    const trip = tripList.get($(this).attr('data-id'));
    trip.fetch({
      success: loadTrip,
      error: failLoad,
    });
  });

  $('button#add').click(function() {
    $('#add-trip').css("display", "block");
  });
  $('span.close').click(function() {
    $('#add-trip').css("display", "none");
  });
  $('body').click(function(event) {
    if (event.target === $('body')) {
      $('#add-trip').css("display", "none");
    }
  });
});
