// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

import 'jquery-modal';

// CSS
import './css/foundation.css';
import './css/style.css';


import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

console.log('it loaded!');

const tripList = new TripList();
console.log(tripList);

let tripTemplate;
let showTemplate;

const reservationFields = ['name', 'age', 'email'];
const newTripFields = ['name', 'continent', 'about', 'category', 'weeks', 'cost']

const updateStatusMessageFrom = (messageHash) => {
  $('#status-messages ul').empty();
  for(let messageType in messageHash) {
    messageHash[messageType].forEach((message) => {
      $('#status-messages ul').append($(`<li>${messageType}:  ${message}</li>`));
      // console.log(`<li>${messageType.charAt(0).toUpperCase()}:  ${message}</li>`);
    })
  }
  $('#status-messages').show();
}

const updateStatusMessageWith = (message) => {
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`${message}</li>`);
  console.log($('#status-messages ul'))
  $('#status-messages').show();
}

const events = {
  allTrips(event) {
    const $tripList = $('#trip-list');
    $tripList.empty();
    $('#all_trips_section').toggle();
    event.preventDefault();
    tripList.forEach((trip) => {
      $tripList.append(tripTemplate(trip.attributes));
    });
  },
  showTrip(id) {
    const $showTrip = $('#show_trip');
    $showTrip.empty();
    $showTrip.show();
    const trip = new Trip({id: id});
    const resForm = `<h2>Reserve Your Spot</h2>
    <form id="reserve-trip-form" action="https://trektravel.herokuapp.com/trips/${id}/reservations" method="post">
    <label for="name">Name</label>
    <input type="text" name="name"></input>

    <label for="age">Age</label>
    <input type="number" name="age"></input>

    <label for="email">Email</label>
    <input type="text" name="email"></input>

    <input id="submitResButton" type="submit" value="Reserve it!" class="button"></input>
    </form>`

    trip.fetch({}).done(() => {
      $showTrip.append(showTemplate(trip.attributes));
      $showTrip.append(resForm);
    });

  },
  finalizeReservation(event) {
    event.preventDefault();
    const url = $(this).attr('action'); // Retrieve the action from the form
    const formData = $(this).serialize();
    $('#show_trip').hide();
    // $(this).hide();
    $.post(url, formData, function(response) {
      $('#message').html('<p> Trip Reserved! </p>');
    }).fail(() => {
      $('#message').html('<p>Reserving Trip Failed</p>');
    });
  },
  addTrip(event) {
    event.preventDefault();
    console.log("IN ADDTRIP FUNCTION");
    const tripData = {};
    newTripFields.forEach( (field) => {
      const val = $(`input[name=${field}]`).val();
      if (val !== '') {
        tripData[field] = val;
      }
    });
    const trip = new Trip(tripData);
    console.log(trip);
    if (trip.isValid()) {
      tripList.add(trip);
      trip.save({}, {
        success: events.successfulSave,
        error: events.failedSave,
      });
    } else {
      // getting here means there were client-side validation errors reported
      updateStatusMessageFrom(trip.validationError);
    }
    // need to add in validations!
  },
  successfulSave(trip, response) {
    $('#message').html('<p> Trip Added! </p>')
    $('#message').delay(1000).hide(1);
    // updateStatusMessageWith(`${trip.get('name')} added!`);
    $.modal.close();
    $.modal.empty;
  },
  failedSave(trip, response) {
    updateStatusMessageFrom(response.responseJSON.errors);
    trip.destroy();
  },
};

$('#all_trips_section').hide();

$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  showTemplate = _.template($('#show-template').html());

  tripList.fetch();

  $('#trips_button').click(events.allTrips);

  $('#all_trips_section').on('click', 'tr', function() {
    $('.current-select-row').removeClass('current-select-row');
    const tripID = $(this).attr('data-id');
    console.log(this);
    $(this).addClass('current-select-row');
    events.showTrip(tripID);
  });

  $('#show_trip').on('submit', 'form', events.finalizeReservation);
  $('#newTrip').submit(events.addTrip);

});
