// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list'
import Reservation from './app/models/reservation'


const tripList = new TripList();
let trip;
let tripTemplate;

const render = function render(tripList) {
  const $tripList = $('#trip-list');
  $tripList.empty();
  tripList.forEach((trip) => {
    $tripList.append(tripTemplate(trip.attributes));
  });
};

const loadTrips = function loadTrips(){
  tripList.on('update', render, tripList);
  tripList.fetch();
};

let infoTemplate;

const loadTripDetails = function loadTripDetails(id) {
  trip = tripList.get(id);
  trip.fetch( {
    success: events.successfulRender,
    error: events.failedRender,
  });
};

const updateStatusMessageWith = (message) => {
  $('#status-messages ul').empty();
  $('#status-messages ul').append(`<li>${message}</li>`);
  $('#status-messages').show();
}

const fields = ['name', 'continent', 'about', 'category', 'weeks', 'cost'];
const resFields = ['name', 'age', 'email'];
const events = {
  addReservation(event) {
    event.preventDefault();
    const resData = {};
    resFields.forEach( (field) => {
      const val = $(`#add-reservation-form input[name=${field}]`).val();
      if (val != '') {
        resData[field] = val;
      }
    });

  const reservation = new Reservation(resData);
    if (reservation.isValid()) {
      // debugger;
      let tripID = $(this).attr('dataid');
      // const getTripNumber = $(event.currentTarget.attributes.tripId).val();
      reservation.urlRoot = `${(new Trip()).urlRoot}${tripID}/reservations`;
      reservation.save({}, {
        success: events.successfulSave,
        error: events.failedSave,
      });
    } else {
      updateStatusMessageWith('reservation is invalid');
      reservation.destroy();
    }
  },
  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    fields.forEach( (field) => {
      const val = $(`input[name=${field}]`).val();
      if (val != '') {
        tripData[field] = val;
      }
    });
    const trip = new Trip(tripData);
    if (trip.isValid()) {
      trip.save({}, {
        success: events.successfulSave,
        error: events.failedSave,
      });
      $('#status-messages ul').empty();
      $('#status-messages ul').append(`INCOMPLETE Client-side errors`);
      $('#status-messages').show();
    }
  },
  successfulSave(trip, response) {
    tripList.add(trip);
    console.log('successful save!');
    console.log(trip);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`);
    $('#status-messages').show();
  },
  failedSave(trip, response) {
    console.log('error');
    console.log(trip);
    console.log(response);
    console.log(response.responseJSON.errors);
    for (let key in response.responseJSON.errors) {
  response.responseJSON.errors[key].forEach((error) => {
    $('#status-messages ul').append(`<li>${key}: ${error}</li>`);

  });
}},
  successfulRender(trip, response) {
    // console.log('success render::::');
    console.log(response)
    const $info = $('.info');
    $info.empty();
    $info.append(infoTemplate(trip.attributes));
    // console.log('last line of renderTrip');
  },
  failedRender(trip, response) {
    // console.log('failed render:::::');
    // console.log(response);
  }
};


$(document).ready( () => {
  tripTemplate = _.template($('#trip-template').html());
  infoTemplate = _.template($('#info-template').html());
  loadTrips();
  $('.all-trips').on('click', function() {
    $('table').toggleClass('active');
  });

  $('#trip-list').on('click', '.trip', function(){
    let tripID = $(this).attr('data-id');
    loadTripDetails(tripID);
    $('#summary').get(0).scrollIntoView();
  });

  $('.add').on('click', function(){
    $('#add-trip-form').toggle({'display': 'block'});
  });

  $('#add-trip-form').submit(events.addTrip);

//   $('#add-reservation-form').submit( function(e {
//     e.preventDefault();
//     console.log('when you click submit...');
//     console.log(this);
//     let tripId = $(this).attr('data-id');
//
//     const url = `https://ada-backtrek-api.herokuapp.com/trips/${tripId}/reservations`;
//     const formData = $(this).serialize();
//
//     $.post(url, formData, (response) => {
//       $('#status-messages ul').append('<p>Spot reserved!</p>');
//       console.log(response);
//       document.getElementById("new-trip-form").reset();
//     }).fail(() => {
//       $("#message").html("<p>Unable to complete reservation</p>")
//     });
// });
$(document).on('submit', '#add-reservation-form', events.addReservation)


});
