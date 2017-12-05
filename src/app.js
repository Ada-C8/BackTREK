// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

// CSS
import './css/foundation.css';
import './css/style.css';

// ----------- All trips / Details ------------
const tripList = new TripList();
let tripTemplate;
let tripDetails;

const render = function render(tripList) {
  const $tripList = $('#trip-list');
  $tripList.empty();

  tripList.forEach((trip) => {
    $tripList.append($(tripTemplate(trip.attributes)).attr('id', `${trip.id}`));
  });
};

const fields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
// const continents = ['Africa', 'Antarctica', 'Asia', 'Australasia', 'Europe', 'South America', 'North America', 'Null'];

// ------------- Status Messages --------------
const updateStatusMessageFrom = (messageHash) => {
  $('#status-messages ul').empty();
  for(let messageType in messageHash) {
    messageHash[messageType].forEach((message) => {
      $('#status-messages ul').append($(`<li>${messageType}:  ${message}</li>`));
    })
  }
  $('#status-messages').show();
}

const updateStatusMessageWith = (message) => {
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`${message}</li>`);
  $('#status-messages').show();
}

const events = {
  // ------------- Add a new Trip --------------
  addTrip(event) {
    console.log(this);
    event.preventDefault();
    const tripData = {};
    fields.forEach((field) => {
      tripData[field.toLowerCase()] = $(`.add-trip-form input[name=${field}]`).val();
      console.log(field);
      console.log(tripData[field]);
    });

    const trip = new Trip(tripData);

    if (trip.isValid()) {

      trip.save({}, {
        success: events.successfullSave,
        error: events.failedSave,
      });
    } else {
      updateStatusMessageFrom(trip.validationError);
    }

  },
  successfullSave(trip, response) {
    updateStatusMessageWith(`${trip.get('name')} added!`);
    tripList.add(trip);
  },
  failedSave(trip, response) {
    updateStatusMessageFrom(response.responseJSON.errors);
    trip.destroy();
  },
  sortTrips(event) {
    $('.current-sort-field').removeClass('current-sort-field');
    $(this).addClass('current-sort-field');

    const classes = $(this).attr('class').split(/\s+/);

    classes.forEach((className) => {
      if (fields.includes(className)) {
        console.log(className);
        if (className === tripList.comparator) {
          tripList.models.reverse();
          tripList.trigger('sort', tripList);
        }
        else {
          tripList.comparator = className;
          tripList.sort();
        }
      }
    });
  },
}

// ----------- All trips / Details ------------
$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripDetails = _.template($('#trip-details-template').html());
  $('.add-trip-form').submit(events.addTrip);
  $('.sort').click(events.sortTrips);
  tripList.on('sort', render, tripList);

  $('#trip-list').hide();
  tripList.on('update', render, tripList);
  tripList.fetch();

  $('#all-trips').on('click', function() {
    $('#trip-list').toggle();
  });

// ----------- Trip Details -------------
  $('#trip-list').on('click', 'tr', function() {
    $('tr').css('background', '');
    const id = $(this).attr('id');
    const url = new Trip(this).url();

    $(`#${id}`).css('background','pink');

    $.get(url, function(response) {
      $(`#trip-details`).html(tripDetails(response));
    });
  });

  // ----------- Modal ------------
  $('#add-trip-button').on('click', function() {
    $('#add-trip').css('display', 'block');
  });

  $(document).on('click', function() {
    const modal = document.getElementById('add-trip');

    if (event.target == modal) {
      event.stopPropagation();
      modal.style.display = 'none';
    }
  });

  // ------------- Reserve a Trip --------------
  $('body').on('submit', '.book-trip', function form(e) {
    e.preventDefault();
    const url = $(this).attr('action');
    const formData = $(this).serialize();

    $.post(url, formData, () => {
      $('.book-trip').html('<h3>Booking Complete</h3>');
    }).fail(() => {
      $('.book-trip').html('<h3>Booking failed</h3>');
    });
  });
});
