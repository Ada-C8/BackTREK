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

  $('th.sort').removeClass('current-sort-field');
  $(`th.sort.${ tripList.comparator }`).addClass('current-sort-field');
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

  tripList.fetch();
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

const updateStatusMessageFrom = (messageHash) => {
  $('#status-messages ul').empty();
  for (let messageType in messageHash) {
    messageHash[messageType].forEach((message) => {
      $('#status-messages ul').append($(`<li>${ messageType }: ${ message }</li>`));
    })
  }
  $('#status-messages').show();
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

    $.post(url, formData, (response) => {
      $('#message').html('<p>Spot reserved!</p>');
      $('#reservation').hide();
      clearForm();
    }).fail(() => {
      $('#message').html('<p>Reservation failed to save.</p>');
    });
  });
};

$(document).ready( () => {
  $('#trips').hide();
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
   render(filteredList);
 });

 $('.sort').click(sortTrips);

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

  $('#new-trip').on('submit', addTrip);
});
