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

const fields = ['Name', 'continent', 'about', 'category', 'weeks', 'cost'];

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
  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    fields.forEach((field) => {
      tripData[field.toLowerCase()] = $(`input[name=${field}]`).val();
      console.log(field);
      console.log(tripData[field]);
    });

    const trip = new Trip(tripData);

    // if (book.isValid()) {

      trip.save({}, {
        success: events.successfullSave,
        error: events.failedSave,
      });
    // } else {
    //   // getting here means there were client-side validation errors reported
    //   // console.log("What's on book in an invalid book?");
    //   // console.log(book);
    //   updateStatusMessageFrom(book.validationError);
    // }

  },
  successfullSave(trip, response) {
    updateStatusMessageWith(`${trip.get('name')} added!`);
    tripList.add(trip);
  },
  failedSave(trip, response) {
    updateStatusMessageFrom(response.responseJSON.errors);
    trip.destroy();
  },
}

// const continents = ['Africa', 'Antarctica', 'Asia', 'Australasia', 'Europe', 'South America', 'North America', 'Null'];

// ------------- Reserve a Trip --------------


// ------------- Add a new Trip --------------


// ----------- All trips / Details ------------
$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  tripDetails = _.template($('#trip-details-template').html());
  $('.add-trip-form').submit(events.addTrip);

  $('#trip-list').hide();
  tripList.on('update', render, tripList);
  tripList.fetch();

  $('#all-trips').on('click', function() {
    $('#trip-list').toggle();
  });

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
});
