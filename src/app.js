// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Trip from './app/models/trip';
import TripList from './app/collections/trip_list';

const tripList = new TripList();
tripList.fetch();

let tripTemplate;
const renderTrips = function renderTrips(tripList) {
  $('.reservation-form').hide();
  $('#trip-info').hide();
  $('#trip-list').empty();
  console.log('here i am rendering trips');
  tripList.forEach((trip) => {
    $('#trip-list').append(tripTemplate(trip.attributes));
  });
  $('#trips-table').show();


};

let singleTripTemplate;
const renderOneTrip = function renderOneTrip(id) {
  $('#trips-table').hide();
  $('#trip-info').empty();
  $('#trip-info').show();

  $('.reservation-form').show();

  let trip;
  trip = new Trip({id: id});
  trip.fetch().done(() => {
    $('#trip-info').append(singleTripTemplate(trip.attributes));
  });
};

const tripFields = ['name', 'cost', 'weeks', 'continent', 'about', 'category'];
const reservationFields = ['name', 'age', 'email'];


const events = {
  addTrip(event) {
    event.preventDefault();
    const tripData = {};
    tripFields.forEach( (field) => {
      let val = $(`input[name=${field}]`).val();
      if (field === 'cost') {
        val = parseFloat(val);
      }
      if (field === 'weeks') {
        val = parseInt(val);
      }
      if (val != '') {
        tripData[field] = val;
      }
    });

    const trip = new Trip(tripData);

    trip.save({}, {
      success: events.successfulSave,
      error: events.failedSave
    });

  },

  // addReservation(event) {
  //   console.log(this);
  //   const id = this.id;
  //   event.preventDefault();
  //   const reservationData = {};
  //   reservationFields.forEach( (field) => {
  //     let val = $(`input[name=${field}]`).val();
  //     if (field === 'age') {
  //       val = parseInt(val);
  //     }
  //     if (val != '') {
  //       reservationData[field] = val;
  //     }
  //   });
  //
  //   const reservation = reservationData;
  //
  //   reservation.save({}, {
  //     url: `https://ada-backtrek-api.herokuapp.com/trips/${id}/reservations`,
  //     success: events.successfulSave,
  //     error: events.failedSave
  //   });
  //
  // },



  // sortBooks(event) {
  //   console.log(event);
  //   console.log(this);
  //   const classes = $(this).attr('class').split(/\s+/);
  //
  //   bookList.comparator = classes[1];
  //
  //   if (classes.includes('current-sort-field')) {
  //     $(this).removeClass('current-sort-field');
  //     bookList.set(bookList.models.reverse());
  //     render(bookList);
  //
  //   } else {
  //     $('.current-sort-field').removeClass('current-sort-field');
  //     $(this).addClass('current-sort-field');
  //     bookList.sort();
  //   };
  // },

  successfulSave(trip, response){
    console.log('success!');
    console.log(trip);
    console.log(response);
    tripList.add(trip);

    $('#status-messages ul').empty();
    $('#status-messages ul').append(`<li>${trip.get('name')} added!</li>`);
    $('#status-messages ul').show();
    $('#new-trip-form').hide();
    $('#trips-table').show();
  },

  failedSave(trip, response) {
    console.log('error');
    console.log(trip);
    console.log(response);
    trip.destroy();
    $('#status-messages ul').empty();
    $('#status-messages ul').append('<li>Your book was unable to be added.</li>');
    $('#status-messages ul').show();
  },

};





$(document).ready(() => {
  tripTemplate = _.template($('#trip-template').html());
  singleTripTemplate = _.template($('#single-trip-template').html());

  $('.reservation-form').hide();
  $('#trips-table').hide();
  $('#new-trip-form').hide();

  $('#trip-list').on('click', 'tr', function (){
    const tripID = $(this).attr('data-id');
    renderOneTrip(tripID);
  });

  $('#view-all-trips').on('click', function (){
    renderTrips(tripList);
  });

  $('#make-a-trip').on('click', function (){
    $('.reservation-form').hide();
    $('#trips-table').hide();
    $('#trip-info').hide();
    $('#new-trip-form').show();
  });

  $('#new-trip-form').submit(events.addTrip);

  $('.reservation-form').submit( function(e) {
    e.preventDefault();
    let tripID = $('.show .trip').attr('data-id');
    console.log(tripID);
    tripID = tripID.match(/\d+/g)[0];

    const url = `https://trektravel.herokuapp.com/trips/${tripID}/reservations`;
    console.log(url);
    const formData = $(this).serialize();

    $.post(url, formData, (response) => {
      $('.reservation-form').hide();
      $('.message').append('<p> Reservation confirmed! </p>');
    }).fail(() => {
      $('.message').append('<p>Adding Reservation Failed</p>');
    });
  });


  tripList.on('update', renderTrips, tripList);


});
