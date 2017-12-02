// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';
import Reservation from './app/models/reservation';

//console.log('it loaded!');

//TRIPS TABLE:
const tripList = new TripList();
let tripsTemplate;

const renderTrips = function renderTrips(tripList) {
  console.log('it loaded!');
  $('#load-trips').hide();
  $('#add-new-trip').show();
  tripsTemplate = _.template($('#trips-template').html());
  //get the element to append to
  const tripListTable = $('#trips-list');
  tripListTable.empty();
  tripList.forEach((trip) => {
    tripListTable.append(tripsTemplate(trip.attributes));
    //console.log(trip);
  });
  console.log('finished loading trips')
};

//TRIP DETAILS (ONE TRIP)
let singleTripTemplate;
const renderSingleTrip = function renderSingleTrip(tripID) {
  console.log('it loaded a trip!');
  console.log(tripID);
  const tripDetailsContainer = $('#trip-details-container');
  tripDetailsContainer.empty();
  //why am i defining let singleTripTemplate outsie of method instead of inside?
  singleTripTemplate = _.template($('#single-trip-template').html());
  let trip;
  trip = new Trip({id: tripID});
  trip.fetch().done(() => {
    $('#trip-details-container').append(singleTripTemplate(trip.attributes));
  });
  console.log(trip);
}



//EVENT LISTENER
//1. Create listener:
// const bogusListener = function bogusListener(event)  {
//   console.log('Event Occurred!');
//   console.log(event);
//   console.log(this);
// };
// // // 2.  Register the Event Handler with the Component
// tripList.on('bogus', bogusListener);
// // // 3.  Trigger the event
// tripList.trigger('bogus', 'Argument!');

const tripFields = ["name", "category", "continent", "cost", "weeks", "about"];
const reservationFields = ["name", "age", "email"];

const events = {
  addTrip(event) {
    event.preventDefault();
    console.log('in addTrip method! Trip Data:')
    const tripData = {};
    tripFields.forEach( (field) => {
      tripData[field] = $(`input[name=${field}]`).val();
    });
    console.log(tripData);
    const trip = new Trip(tripData);

    if (trip.isValid()) {
      trip.save({}, {
        success: events.successfullTripSave,
        error: events.failedTripSave,
      });
    } else {
      console.log('NOT VALID')
      events.failedTripSave(trip, {errors: trip.validate() });
    }

    console.log('finished')

  },
  successfullTripSave(trip, response) {
    console.log('successfulTripSave');
    tripList.add(trip);
    console.log('Trip Added');
    console.log(trip);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`)
    $('#status-messages').show();
  },
  failedTripSave(trip, response) {
    console.log('failedSave');
    //console.log(trip);
    //console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} WAS NOT added!</li>`);
    console.log(response.responseJSON);
    const displayErrors = response.responseJSON.errors
    for (var key in displayErrors){
      console.log(key);
      $('#status-messages ul').append(`<li>${key}: ${displayErrors[key]}</li>`);
    };
    $('#status-messages').show();
  },
  addReservation(event) {
    event.preventDefault();
    console.log('in addReservation method! Reservation Data:');
    const reservationData = {};
    reservationFields.forEach( (field) => {
      reservationData[field] = $(`#add-reservation-form input[name=${field}]`).val();
    });
    console.log(reservationData);
    const tripNumber= $('#add-reservation-form').attr('trip-id');

    console.log(`tripNumber: ${tripNumber}`);

    // reservation.set({"tripID": `${tripNumber}` });
    const postURL = `https://ada-backtrek-api.herokuapp.com/trips/${tripNumber}/reservations/`;
    const reservation = new Reservation(reservationData);
    //const reservation = new Reservation(reservationData, {url:postURL});
    reservation.set({"url": `${postURL}` });
    console.log(reservation.get('url'));
    console.log(reservation);
    if (reservation.isValid()) {
      reservation.save({}, {
        success: events.successfullReservationSave,
        error: events.failedReservationSave,
      });
    } else {
      console.log('NOT VALID RESERVATION DATA')
      events.failedReservationSave(reservation, {errors: reservation.validate() });
    }
  },
  successfullReservationSave(reservation, response) {
    console.log('successfulReservationSave');
    console.log(reservation);
    console.log(response);
    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${reservation.get('name')} added!</li>`)
    $('#status-messages').show();
  },
  failedReservationSave(reservation, response) {
    console.log('failedReservationSave');
    console.log(reservation);
    console.log(response);
    console.log(response.responseText);
    //let JSONresponse = JSON.parse(response);
    //console.log(JSONresponse);
    //console.log(JSON.stringify(response));
    //const responseJSON = JSON.stringify(response);
    $('#status-messages ul').append(`<li>${reservation.get('name')} WAS NOT added!</li>`);
    $('#status-messages ul').empty();
    //responseJSON.forEach(function(data) {
    //  $('#status-messages ul').append(`<li>${data}</li>`);
    //});
    $('#status-messages').show();
  },

};

$(document).ready( () => {
  $('#reservation-form-container').hide();
  $('#add-a-trip-form-container').hide();
  $('#trips-table-container').hide();
  $('#add-new-trip').hide();

  $('#load-trips').on('click', function(){
    console.log('clicked load');
    $('#trips-table-container').show();
    tripList.fetch();
  });

  $('#trips-table-container').on('click', 'tr', function () {
    const tripID = $(this).attr('data-id');
    renderSingleTrip(tripID);
    $('#add-reservation-form').attr('trip-id',`${tripID}`);
    $('#reservation-form-container').show();
  });

  //show form to Add a Trip
  $('#add-new-trip').on('click', function() {
    $('#add-a-trip-form-container').show();
  });

  //submit form to Add a Trip
  //creates a new instance of the Trip model
  $('#add-a-trip-form-container').on('submit','#add-trip-form', events.addTrip);
  //tripsTemplate = _.template($('#trips-template').html());
    //THIS WAY DOESN"T WORK- it just performs the submit, rather than waits to hear if a submit event is happening
    //$('#add-trip-form').submit(events.addTrip);

  //submit form to add a reservation:
  $('#reservation-form-container').on('submit','#add-reservation-form', events.addReservation);

  //update table
  tripList.on('update', renderTrips, tripList);

  // $('.sort').click(events.sortTrips);
  // tripList.on('sort',renderTrips,tripList);


});
